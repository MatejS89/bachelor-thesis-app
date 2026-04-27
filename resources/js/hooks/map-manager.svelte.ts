import { page, useHttp } from '@inertiajs/svelte';
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

const LAYERS = {
    CUSTOM_FEATURES: 'custom-features',
    SEARCH_RESULTS: 'search-results',
};

export class MapManager {
    constructor(onFeatureClick: (id: number) => void) {
        this.onFeatureClick = onFeatureClick;

        this.http = useHttp({
            north: null as number | null,
            south: null as number | null,
            east: null as number | null,
            west: null as number | null,
            allergens: [] as string[],
        });
    }

    public get isProcessing(): boolean {
        return this.http.processing;
    }

    private http;

    private readonly onFeatureClick: (id: number) => void;
    map: Map | undefined = $state<Map>();
    userLocation: { lat: number; lng: number } | null = $state(null);

    public featureData: FeatureCollection = $state({
        type: 'FeatureCollection',
        features: [],
    });

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
        this.fetchFeaturesForCurrentBounds();
    }

    public fetchFeaturesForCurrentBounds = (query?: any) => {
        const bounds = this.getBounds();

        if (!bounds) {
            return;
        }

        this.http.north = bounds.north;
        this.http.south = bounds.south;
        this.http.east = bounds.east;
        this.http.west = bounds.west;

        if (query) {
            this.http.allergens = query.allergens;
        } else {
            this.http.allergens = page.props.query.allergens;
        }

        this.http.get('/map-data', {
            onSuccess: (data) => {
                const currentData = data as FeatureCollection<Point>;

                this.setFeatures(currentData);
            },
        });
    };

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

        this.geolocateControl.on('geolocate', () =>
            this.fetchFeaturesForCurrentBounds(),
        );

        this.map.addControl(new FullscreenControl());

        this.attachLayerInteractions(`${LAYERS.CUSTOM_FEATURES}-layer`);
        this.attachLayerInteractions(`${LAYERS.CUSTOM_FEATURES}-label-layer`);

        this.fetchFeaturesForCurrentBounds();
    }

    private attachLayerInteractions(layerId: string) {
        if (!this.map) {
            return;
        }

        this.map.on('click', layerId, (e) => {
            if (e.features && e.features.length > 0) {
                const feature = e.features[0];
                const featureId = feature.id as number;

                if (featureId) {
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
        this.setLayerVisibility(`${LAYERS.CUSTOM_FEATURES}-layer`, visible);
    }

    toggleSearchResults(visible: boolean) {
        this.setLayerVisibility(`${LAYERS.SEARCH_RESULTS}-layer`, visible);
    }

    setFeatures(featureCollection: FeatureCollection<Point>) {
        this.featureData = featureCollection;

        if (!this.map) {
            return;
        }

        const update = () => {
            const source = this.map!.getSource(
                LAYERS.CUSTOM_FEATURES,
            ) as maplibregl.GeoJSONSource;

            if (source) {
                source.setData(featureCollection);
            } else {
                this.map!.addSource(LAYERS.CUSTOM_FEATURES, {
                    type: 'geojson',
                    data: featureCollection,
                });

                const colorExpression = buildRatioColorExpression(
                    'safe_items_count',
                    'total_items_count',
                );

                this.map!.addLayer({
                    id: `${LAYERS.CUSTOM_FEATURES}-layer`,
                    type: 'circle',
                    source: LAYERS.CUSTOM_FEATURES,
                    paint: {
                        'circle-radius': 6,
                        'circle-color': colorExpression,
                        'circle-stroke-width': 2,
                        'circle-stroke-color': '#ffffff',
                    },
                });

                this.map!.addLayer({
                    id: `${LAYERS.CUSTOM_FEATURES}-label-layer`,
                    type: 'symbol',
                    source: LAYERS.CUSTOM_FEATURES,
                    minzoom: 14,
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
                LAYERS.CUSTOM_FEATURES,
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
            if (this.map!.getLayer('custom-features-layer')) {
                this.map!.setLayoutProperty(
                    'custom-features-layer',
                    'visibility',
                    'none',
                );
            }

            const featureCollection: FeatureCollection = {
                type: 'FeatureCollection',
                features: features,
            };

            const sourceId = LAYERS.SEARCH_RESULTS;
            const source = this.map!.getSource(
                sourceId,
            ) as maplibregl.GeoJSONSource;

            if (source) {
                source.setData(featureCollection);
            } else {
                this.map!.addSource(sourceId, {
                    type: 'geojson',
                    data: featureCollection,
                });

                this.map!.addLayer({
                    id: `${sourceId}-layer`,
                    type: 'circle',
                    source: sourceId,
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

        const sourceId = LAYERS.SEARCH_RESULTS;
        const source = this.map.getSource(sourceId) as maplibregl.GeoJSONSource;

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
            animate: false,
        });

        this.fetchFeaturesForCurrentBounds();
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
}
