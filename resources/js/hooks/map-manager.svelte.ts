import type { FeatureCollection, Point, Feature, BBox } from 'geojson';
import maplibregl, { GeolocateControl, NavigationControl } from 'maplibre-gl';
import type { Map } from 'maplibre-gl';
import type { BoundingBox } from '@/types';

const LAYERS = {
    CUSTOM_FEATURES: 'custom-features',
    SEARCH_RESULTS: 'search-results',
};

export class MapManager {
    constructor(onBoundsChange: (bounds: BoundingBox) => void) {
        this.onBoundsChange = onBoundsChange;
    }

    private onBoundsChange: (bounds: any) => void;
    map: Map | undefined = $state<Map>();
    userLocation: { lat: number; lng: number } | null = $state(null);

    private geolocateControl: GeolocateControl | undefined;

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

    private fetchFeaturesForCurrentBounds = (e?: any) => {
        if (e?.ignoreFetch) {
            return;
        }

        const bounds = this.getBounds();

        if (!bounds) {
            return;
        }

        this.onBoundsChange(bounds);
    };

    initialize(container: HTMLElement) {
        this.map = new maplibregl.Map({
            container: container,
            style: 'https://basemaps.cartocdn.com/gl/positron-gl-style/style.json',
            hash: true,
        });

        this.map.addControl(new NavigationControl());

        this.geolocateControl = new GeolocateControl({
            positionOptions: { enableHighAccuracy: true },
        });

        this.map.addControl(this.geolocateControl);

        this.geolocateControl.on(
            'geolocate',
            this.fetchFeaturesForCurrentBounds,
        );
    }

    toggleCustomFeatures(visible: boolean) {
        this.setLayerVisibility(`${LAYERS.CUSTOM_FEATURES}-layer`, visible);
    }

    toggleSearchResults(visible: boolean) {
        this.setLayerVisibility(`${LAYERS.SEARCH_RESULTS}-layer`, visible);
    }

    setFeatures(featureCollection: FeatureCollection<Point>) {
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

                this.map!.addLayer({
                    id: `${LAYERS.CUSTOM_FEATURES}-layer`,
                    type: 'circle',
                    source: LAYERS.CUSTOM_FEATURES,
                    paint: {
                        'circle-radius': 6,
                        'circle-color': '#ff4757',
                        'circle-stroke-width': 2,
                        'circle-stroke-color': '#ffffff',
                    },
                });

                this.map!.addLayer({
                    id: `${LAYERS.CUSTOM_FEATURES}-hover-layer`,
                    type: 'circle',
                    source: LAYERS.CUSTOM_FEATURES,
                    paint: {
                        'circle-radius': 10,
                        'circle-color': '#ff4757',
                        'circle-stroke-width': 3,
                        'circle-stroke-color': '#000000',
                    },
                    filter: ['==', ['get', 'id'], ''],
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

    highlightFeature(id: string | number | null) {
        if (
            !this.map ||
            !this.map.getLayer(`${LAYERS.CUSTOM_FEATURES}-hover-layer`)
        ) {
            return;
        }

        if (id === null) {
            this.map.setFilter(`${LAYERS.CUSTOM_FEATURES}-hover-layer`, [
                '==',
                ['get', 'id'],
                '',
            ]);
        } else {
            this.map.setFilter(`${LAYERS.CUSTOM_FEATURES}-hover-layer`, [
                '==',
                ['get', 'id'],
                id,
            ]);
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

        this.map.fitBounds(bounds, { padding: 50, maxZoom: 15 });
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
