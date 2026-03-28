<script lang="ts">
    import MaplibreGeocoder from '@maplibre/maplibre-gl-geocoder';
    import type { GeoJSONSource, Map as MapLibreMap } from 'maplibre-gl';
    import maplibregl from 'maplibre-gl';
    import { onMount } from 'svelte';
    import 'maplibre-gl/dist/maplibre-gl.css';
    import map from '@/routes/map';
    import { getMapContext } from '@/state/mapState.svelte';
    import type { BoundingBox } from '@/types';
    import { selectPlace } from '@/utils/mapNavigation';
    import '@maplibre/maplibre-gl-geocoder/dist/maplibre-gl-geocoder.css';

    const mapContext = getMapContext();

    let { selectedFeature }: {
        selectedFeature?: any,
    } = $props();

    let mapContainer: HTMLDivElement;
    let mapLibre: MapLibreMap;
    let selectedMarker: maplibregl.Marker | null = null;

    const MARKER_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#dc2626" width="48" height="48" style="filter: drop-shadow(0 4px 3px rgb(0 0 0 / 0.07)) drop-shadow(0 2px 2px rgb(0 0 0 / 0.06)); display: block;"><path fill-rule="evenodd" d="M11.54 22.351l.07.04.028.016a.76.76 0 00.723 0l.028-.015.071-.041a16.975 16.975 0 001.144-.742 19.58 19.58 0 002.683-2.282c1.944-1.99 3.963-4.98 3.963-8.827a8.25 8.25 0 00-16.5 0c0 3.846 2.02 6.837 3.963 8.827a19.58 19.58 0 002.682 2.282 16.975 16.975 0 001.145.742zM12 13.5a3 3 0 100-6 3 3 0 000 6z" clip-rule="evenodd" /></svg>`;
    const MAP_STYLE = 'https://basemaps.cartocdn.com/gl/positron-gl-style/style.json';

    onMount(() => {
        initMap();
    });

    const geocoderApi = {
        forwardGeocode: async (config) => {
            try {
                const encodedQuery = encodeURIComponent(config.query);

                let proximityParam = '';

                if (mapLibre) {
                    const center = mapLibre.getCenter();
                    proximityParam = `&lat=${center.lat}&lon=${center.lng}`;
                }

                const request = `https://nominatim.openstreetmap.org/search?format=geojson&q=${encodedQuery}${proximityParam}&addressdetails=1&limit=5`;

                const response = await fetch(request, {
                    headers: {
                        'Accept-Language': 'en'
                    }
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const data = await response.json();

                const mappedFeatures = data.features.map((feature: any) => {
                    const center = feature.geometry.coordinates;

                    return {
                        ...feature,
                        id: feature.properties.place_id,
                        place_name: feature.properties.display_name,
                        text: feature.properties.name || feature.properties.display_name.split(',')[0],
                        center: center,
                        properties: feature.properties,
                        place_type: [feature.properties.type, feature.properties.category]
                    };
                });

                return {
                    type: 'FeatureCollection' as const,
                    features: mappedFeatures
                };
            } catch (e) {
                console.error(`Failed to forwardGeocode with error: ${e}`);

                return { type: 'FeatureCollection' as const, features: [] };
            }
        }
    };

    function initMap() {
        mapLibre = new maplibregl.Map({
            container: mapContainer,
            style: MAP_STYLE,
            maxZoom: 20,
            hash: true
        });

        mapLibre.on('load', () => {
            addMapControls();
            addMapSourcesAndLayers();
            bindMapEvents();

            if (selectedFeature?.geom?.coordinates) {
                mapLibre.flyTo({ center: selectedFeature.geom.coordinates, zoom: 17, speed: 1.2, essential: true });
            }

            fetchFeatures();
        });
    }

    function createGeoCoder() {
        const geocoder = new MaplibreGeocoder(geocoderApi, {
            maplibregl,
            marker: false,
            placeholder: 'Search for a place...'
        });

        geocoder.on('result', (e) => {
            const selectedFeature = e.result;

            const featureId = selectedFeature?.properties?.osm_id;
            const featureType = selectedFeature?.properties?.osm_type || '';

            if (featureId) {
                console.log(featureId, featureType);
            } else {
                console.warn('Could not find an ID for the selected feature:', selectedFeature);
            }
        });

        return geocoder;
    }


    function addMapControls() {
        mapLibre.addControl(createGeoCoder());

        mapLibre.addControl(new maplibregl.NavigationControl());

        mapLibre.addControl(new maplibregl.GeolocateControl({
            positionOptions: { enableHighAccuracy: true },
            trackUserLocation: true
        }));
    }

    function addMapSourcesAndLayers() {
        mapLibre.addSource('osm-data', {
            type: 'geojson',
            data: mapContext.visibleFeatures,
            cluster: true,
            clusterMaxZoom: 14,
            clusterRadius: 50
        });

        mapLibre.addLayer({
            id: 'places-layer-clusters',
            type: 'circle',
            source: 'osm-data',
            filter: ['has', 'point_count'],
            paint: {
                'circle-color': ['step', ['get', 'point_count'], '#51bbd6', 10, '#f1f075', 50, '#f28cb1'],
                'circle-radius': ['step', ['get', 'point_count'], 20, 10, 30, 50, 40],
                'circle-stroke-width': 1,
                'circle-stroke-color': '#fff'
            }
        });

        mapLibre.addLayer({
            id: 'places-layer-cluster-count',
            type: 'symbol',
            source: 'osm-data',
            filter: ['has', 'point_count'],
            layout: { 'text-field': '{point_count_abbreviated}', 'text-font': ['Noto Sans Regular'], 'text-size': 12 }
        });

        mapLibre.addLayer({
            id: 'osm-points',
            type: 'circle',
            source: 'osm-data',
            paint: { 'circle-radius': 5, 'circle-color': '#f00' },
            filter: ['!', ['has', 'point_count']]
        });

        mapLibre.addLayer({
            id: 'osm-points-labels',
            type: 'symbol',
            source: 'osm-data',
            layout: {
                'text-field': ['get', 'name'],
                'text-font': ['Noto Sans Regular'],
                'text-offset': [0, 0.8],
                'text-anchor': 'top',
                'text-size': 12,
                'text-optional': true
            },
            paint: { 'text-color': '#333', 'text-halo-color': '#fff', 'text-halo-width': 1 },
            filter: ['!', ['has', 'point_count']]
        });
    }

    function bindMapEvents() {
        mapLibre.on('click', 'osm-points', (e) => {
            if (e.features && e.features.length > 0) {
                selectPlace(e.features[0].properties.id);
            }
        });

        mapLibre.on('click', (e) => {
            const features = mapLibre.queryRenderedFeatures(e.point, { layers: ['osm-points', 'places-layer-clusters'] });

            if (!features.length) {
                selectPlace(null);
            }
        });

        mapLibre.on('mouseenter', 'osm-points', () => (mapLibre.getCanvas().style.cursor = 'pointer'));
        mapLibre.on('mouseleave', 'osm-points', () => (mapLibre.getCanvas().style.cursor = ''));

        mapLibre.on('click', 'places-layer-clusters', (e) => {
            if (!mapLibre || !e.features || e.features.length === 0) {
                return;
            }

            const feature = e.features[0];
            const source = mapLibre.getSource('osm-data') as GeoJSONSource;

            source.getClusterExpansionZoom(feature.properties?.cluster_id).then((zoom) => {
                mapLibre.flyTo({ center: (feature.geometry as any).coordinates, zoom, speed: 1.2, essential: true });
            });
        });

        mapLibre.on('moveend', fetchFeatures);
    }

    async function fetchFeatures() {
        if (!mapLibre) {
            return;
        }

        const bounds = mapLibre.getBounds();
        const bbox: BoundingBox = {
            west: Number(bounds.getWest().toFixed(5)),
            south: Number(bounds.getSouth().toFixed(5)),
            east: Number(bounds.getEast().toFixed(5)),
            north: Number(bounds.getNorth().toFixed(5))
        };

        const existingParams = Object.fromEntries(new URLSearchParams(window.location.search));

        const route = map.index({
            query: {
                ...existingParams,
                ...bbox
            }
        });

        try {
            const response = await fetch(route.url, {
                method: route.method
            });

            const source = mapLibre.getSource('osm-data') as GeoJSONSource;

            if (response.ok) {
                mapContext.visibleFeatures = await response.json();
                source.setData(mapContext.visibleFeatures);
            }
        } catch (error) {
            console.error('Error fetching map data via Wayfinder:', error);
        }
    }

    function syncMarker(coords: [number, number] | undefined) {
        if (!coords) {
            selectedMarker?.remove();
            selectedMarker = null;

            return;
        }

        if (!selectedMarker) {
            const el = document.createElement('div');
            el.className = 'selected-marker';
            el.innerHTML = MARKER_SVG;

            selectedMarker = new maplibregl.Marker({ element: el, anchor: 'bottom', offset: [0, 10] })
                .setLngLat(coords)
                .addTo(mapLibre);
        } else {
            selectedMarker.setLngLat(coords);
        }
    }

    $effect(() => {
        if (mapLibre) {
            syncMarker(selectedFeature?.geom?.coordinates);
        }
    });
</script>

<div bind:this={mapContainer} class="h-full w-full"></div>
