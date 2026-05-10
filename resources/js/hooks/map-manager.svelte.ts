import type { FeatureCollection, Point, Feature, BBox } from 'geojson';
import maplibregl, {
    FullscreenControl,
    GeolocateControl,
    NavigationControl,
} from 'maplibre-gl';
import type { Map } from 'maplibre-gl';
import type { BoundingBox } from '@/types';
import {
    buildRatioColorExpression,
    getRatioColor,
    COLOR_CONFIG,
} from '@/utils/get_color';

const SOURCES = {
    CUSTOM_FEATURES: 'custom-features',
    SEARCH_RESULTS: 'search-results',
} as const;

const LAYERS = {
    CUSTOM_FEATURES_CIRCLES: 'custom-features-layer',
    CUSTOM_FEATURES_LABELS: 'custom-features-label-layer',
    CUSTOM_FEATURES_CLUSTERS: 'custom-features-clusters-layer',
    CUSTOM_FEATURES_CLUSTER_COUNT: 'custom-features-cluster-count-layer',
    SEARCH_RESULTS_CIRCLES: 'search-results-layer',
} as const;

export class MapManager {
    constructor(
        private readonly onFeatureClick: (id: number) => void,
        private readonly triggerFetch: () => void,
    ) {}

    map: Map | undefined = $state<Map>();
    userLocation: { lat: number; lng: number } | null = $state(null);

    private geolocateControl: GeolocateControl | undefined;
    private hoverMarker: maplibregl.Marker | null = null;

    private setLayerVisibility(layerId: string, isVisible: boolean) {
        if (!this.map) {
            return;
        }

        if (this.map.getLayer(layerId)) {
            this.map.setLayoutProperty(
                layerId,
                'visibility',
                isVisible ? 'visible' : 'none',
            );
        }
    }

    public handleGeolocate() {
        this.triggerFetch();
    }

    private fetchAfterMove() {
        if (!this.map) {
            return;
        }

        if (this.map.isMoving()) {
            this.map.once('moveend', () => this.triggerFetch());
        } else {
            this.triggerFetch();
        }
    }

    initialize(container: HTMLElement) {
        this.map = new maplibregl.Map({
            container: container,
            style: 'https://basemaps.cartocdn.com/gl/positron-gl-style/style.json',
            hash: true,
            attributionControl: { compact: true },
        });

        this.map.addControl(new NavigationControl());

        this.geolocateControl = new GeolocateControl({
            positionOptions: { enableHighAccuracy: true },
        });

        this.map.addControl(this.geolocateControl);

        this.geolocateControl.on('geolocate', (e) => {
            const position = e as GeolocationPosition;

            this.userLocation = {
                lat: position.coords.latitude,
                lng: position.coords.longitude,
            };

            this.fetchAfterMove();
        });

        this.map.addControl(new FullscreenControl());

        this.attachLayerInteractions(LAYERS.CUSTOM_FEATURES_CIRCLES);
        this.attachLayerInteractions(LAYERS.CUSTOM_FEATURES_LABELS);
        this.attachClusterInteractions();

        this.triggerFetch();
    }

    private attachClusterInteractions() {
        if (!this.map) {
            return;
        }

        const layerId = LAYERS.CUSTOM_FEATURES_CLUSTERS;

        this.map.on('click', layerId, async (e) => {
            if (!this.map || !e.features || e.features.length === 0) {
                return;
            }

            const feature = e.features[0];
            const clusterId = feature.properties?.cluster_id;

            if (clusterId === undefined || feature.geometry.type !== 'Point') {
                return;
            }

            const source = this.map.getSource(
                SOURCES.CUSTOM_FEATURES,
            ) as maplibregl.GeoJSONSource;

            const zoom = await source.getClusterExpansionZoom(clusterId);
            const coordinates = feature.geometry.coordinates as [
                number,
                number,
            ];

            this.map.easeTo({ center: coordinates, zoom });
        });

        this.map.on('mouseenter', layerId, () => {
            this.map!.getCanvas().style.cursor = 'pointer';
        });

        this.map.on('mouseleave', layerId, () => {
            this.map!.getCanvas().style.cursor = '';
        });
    }

    private attachLayerInteractions(layerId: string) {
        if (!this.map) {
            return;
        }

        this.map.on('click', layerId, (e) => {
            if (e.features && e.features.length > 0) {
                const feature = e.features[0];
                const featureId = feature.id as number;

                if (featureId !== null) {
                    this.onFeatureClick(featureId);
                }
            }
        });

        this.map.on('mouseenter', layerId, () => {
            this.map!.getCanvas().style.cursor = 'pointer';
        });

        this.map.on('mouseleave', layerId, () => {
            this.map!.getCanvas().style.cursor = '';
        });
    }

    toggleCustomFeatures(visible: boolean) {
        this.setLayerVisibility(LAYERS.CUSTOM_FEATURES_CIRCLES, visible);
        this.setLayerVisibility(LAYERS.CUSTOM_FEATURES_LABELS, visible);
        this.setLayerVisibility(LAYERS.CUSTOM_FEATURES_CLUSTERS, visible);
        this.setLayerVisibility(LAYERS.CUSTOM_FEATURES_CLUSTER_COUNT, visible);
    }

    toggleSearchResults(visible: boolean) {
        this.setLayerVisibility(LAYERS.SEARCH_RESULTS_CIRCLES, visible);
    }

    setFeatures(featureCollection: FeatureCollection<Point>) {
        if (!this.map) {
            return;
        }

        const update = () => {
            const source = this.map!.getSource(
                SOURCES.CUSTOM_FEATURES,
            ) as maplibregl.GeoJSONSource;

            if (source) {
                source.setData(featureCollection);
            } else {
                this.map!.addSource(SOURCES.CUSTOM_FEATURES, {
                    type: 'geojson',
                    data: featureCollection,
                    cluster: true,
                    clusterMaxZoom: 14,
                    clusterRadius: 50,
                    clusterProperties: {
                        safe_items_count: [
                            '+',
                            ['get', 'safe_items_count'],
                        ],
                        total_items_count: [
                            '+',
                            ['get', 'total_items_count'],
                        ],
                    },
                });

                const colorExpression = buildRatioColorExpression(
                    'safe_items_count',
                    'total_items_count',
                );

                this.map!.addLayer({
                    id: LAYERS.CUSTOM_FEATURES_CLUSTERS,
                    type: 'circle',
                    source: SOURCES.CUSTOM_FEATURES,
                    filter: ['has', 'point_count'],
                    paint: {
                        'circle-radius': [
                            'step',
                            ['get', 'point_count'],
                            14,
                            10,
                            18,
                            50,
                            22,
                        ],
                        'circle-color': colorExpression,
                        'circle-stroke-width': 2,
                        'circle-stroke-color': '#ffffff',
                    },
                });

                this.map!.addLayer({
                    id: LAYERS.CUSTOM_FEATURES_CLUSTER_COUNT,
                    type: 'symbol',
                    source: SOURCES.CUSTOM_FEATURES,
                    filter: ['has', 'point_count'],
                    layout: {
                        'text-field': ['get', 'point_count_abbreviated'],
                        'text-font': [
                            'Open Sans Regular',
                            'Arial Unicode MS Regular',
                        ],
                        'text-size': 12,
                    },
                    paint: {
                        'text-color': '#ffffff',
                    },
                });

                this.map!.addLayer({
                    id: LAYERS.CUSTOM_FEATURES_CIRCLES,
                    type: 'circle',
                    source: SOURCES.CUSTOM_FEATURES,
                    filter: ['!', ['has', 'point_count']],
                    paint: {
                        'circle-radius': 6,
                        'circle-color': colorExpression,
                        'circle-stroke-width': 2,
                        'circle-stroke-color': '#ffffff',
                    },
                });

                this.map!.addLayer({
                    id: LAYERS.CUSTOM_FEATURES_LABELS,
                    type: 'symbol',
                    source: SOURCES.CUSTOM_FEATURES,
                    minzoom: 14,
                    filter: ['!', ['has', 'point_count']],
                    layout: {
                        'text-field': ['get', 'name'],
                        'text-font': [
                            'Open Sans Regular',
                            'Arial Unicode MS Regular',
                        ],
                        'text-size': 12,
                        'text-justify': 'auto',
                        'text-variable-anchor-offset': [
                            'top',
                            [0, 1],
                            'bottom',
                            [0, -1],
                        ],
                        'text-max-width': 10,
                    },
                    paint: {
                        'text-color': '#374151',
                        'text-halo-color': '#ffffff',
                        'text-halo-width': 2,
                    },
                });
            }

            this.toggleCustomFeatures(true);
        };

        if (this.map.isStyleLoaded()) {
            update();
        } else {
            this.map.once('load', update);
        }
    }

    highlightFeature(id: number | null) {
        if (!this.map) {
            return;
        }

        if (this.hoverMarker) {
            this.hoverMarker.remove();
            this.hoverMarker = null;
        }

        if (id !== null) {
            const features = this.map.querySourceFeatures(
                SOURCES.CUSTOM_FEATURES,
                {
                    filter: ['==', ['id'], id],
                },
            );

            if (features && features.length > 0) {
                const feature = features[0];
                const properties = feature.properties;

                if (feature.geometry.type === 'Point') {
                    const coordinates = [...feature.geometry.coordinates] as [
                        number,
                        number,
                    ];

                    const safe = properties?.safe_items_count ?? 0;
                    const total = properties?.total_items_count ?? 0;
                    const status = getRatioColor(safe, total);

                    const hexColor = COLOR_CONFIG.mapColors[status];

                    this.hoverMarker = new maplibregl.Marker({
                        color: hexColor,
                        scale: 1.1,
                    })
                        .setLngLat(coordinates)
                        .addTo(this.map!);
                }
            }
        }
    }

    displaySearchResults(features: Feature[]) {
        if (!this.map) {
            return;
        }

        const update = () => {
            const featureCollection: FeatureCollection = {
                type: 'FeatureCollection',
                features: features,
            };

            const source = this.map!.getSource(
                SOURCES.SEARCH_RESULTS,
            ) as maplibregl.GeoJSONSource;

            if (source) {
                source.setData(featureCollection);
            } else {
                this.map!.addSource(SOURCES.SEARCH_RESULTS, {
                    type: 'geojson',
                    data: featureCollection,
                });

                this.map!.addLayer({
                    id: LAYERS.SEARCH_RESULTS_CIRCLES,
                    type: 'circle',
                    source: SOURCES.SEARCH_RESULTS,
                    paint: {
                        'circle-radius': 8,
                        'circle-color': '#3b82f6',
                        'circle-stroke-width': 2,
                        'circle-stroke-color': '#ffffff',
                    },
                });
            }

            if (features.length > 0) {
                const bounds = new maplibregl.LngLatBounds();

                features.forEach((feature: Feature) => {
                    if (feature.bbox) {
                        bounds.extend([
                            feature.bbox[0],
                            feature.bbox[1],
                            feature.bbox[2],
                            feature.bbox[3],
                        ]);
                    } else if (feature?.geometry.type === 'Point') {
                        bounds.extend([
                            feature.geometry.coordinates[0],
                            feature.geometry.coordinates[1],
                        ]);
                    }
                });

                if (!bounds.isEmpty()) {
                    this.map!.fitBounds(
                        bounds,
                        { padding: 50, maxZoom: 15 },
                        { ignoreFetch: true },
                    );
                }
            }

            this.toggleCustomFeatures(false);
            this.toggleSearchResults(true);
        };

        if (this.map.isStyleLoaded()) {
            update();
        } else {
            this.map.once('load', update);
        }
    }

    clearSearchResults() {
        if (!this.map) {
            return;
        }

        const source = this.map.getSource(
            SOURCES.SEARCH_RESULTS,
        ) as maplibregl.GeoJSONSource;

        if (source) {
            source.setData({
                type: 'FeatureCollection',
                features: [],
            });
        }

        this.toggleCustomFeatures(true);
    }

    destroy() {
        if (this.map) {
            this.map.remove();
            this.map = undefined;
        }
    }

    flyToLocation(lng: number, lat: number, zoom: number = 15) {
        if (!this.map) {
            return;
        }

        this.map.flyTo({ center: [lng, lat], zoom });
        this.fetchAfterMove();
    }

    fitToFeatures(bbox: BBox) {
        if (!this.map) {
            return;
        }

        const bounds: [number, number, number, number] =
            bbox.length === 6
                ? [bbox[0], bbox[1], bbox[3], bbox[4]]
                : (bbox as [number, number, number, number]);

        this.map.fitBounds(bounds, {
            padding: 50,
            maxZoom: 15,
        });

        this.fetchAfterMove();
    }

    triggerGeolocation() {
        if (this.geolocateControl) {
            this.geolocateControl.trigger();
        } else {
            console.warn('Geolocate control is not initialized yet.');
        }
    }

    getBounds(precision: number = 5): BoundingBox | undefined {
        if (!this.map) {
            console.warn('Map is not initialized.');

            return undefined;
        }

        const bounds = this.map.getBounds();
        const round = (val: number) => Number(val.toFixed(precision));

        return {
            west: round(bounds.getWest()),
            south: round(bounds.getSouth()),
            north: round(bounds.getNorth()),
            east: round(bounds.getEast()),
        };
    }

    getUserLocation(): { lat: number; lng: number } | null {
        return this.userLocation;
    }
}
