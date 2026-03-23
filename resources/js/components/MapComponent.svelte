<script lang="ts">
    import type { Map as MapLibreMap, GeoJSONSource } from 'maplibre-gl';
    import { Map, NavigationControl, GeolocateControl, Marker } from 'maplibre-gl';
    import { onMount } from 'svelte';
    import 'maplibre-gl/dist/maplibre-gl.css';

    let { visibleFeatures = $bindable([]), selectedFeature, selectPlace }: {
        visibleFeatures?: any[],
        selectedFeature?: any,
        selectPlace: (id: number | null) => void
    } = $props();

    let mapContainer: HTMLDivElement;
    let map: MapLibreMap;
    let selectedMarker: Marker | null = null;

    const MARKER_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#dc2626" width="48" height="48" style="filter: drop-shadow(0 4px 3px rgb(0 0 0 / 0.07)) drop-shadow(0 2px 2px rgb(0 0 0 / 0.06)); display: block;"><path fill-rule="evenodd" d="M11.54 22.351l.07.04.028.016a.76.76 0 00.723 0l.028-.015.071-.041a16.975 16.975 0 001.144-.742 19.58 19.58 0 002.683-2.282c1.944-1.99 3.963-4.98 3.963-8.827a8.25 8.25 0 00-16.5 0c0 3.846 2.02 6.837 3.963 8.827a19.58 19.58 0 002.682 2.282 16.975 16.975 0 001.145.742zM12 13.5a3 3 0 100-6 3 3 0 000 6z" clip-rule="evenodd" /></svg>`;
    const MAP_STYLE = 'https://basemaps.cartocdn.com/gl/positron-gl-style/style.json';

    onMount(() => {
        initMap();
    });

    function initMap() {
        map = new Map({
            container: mapContainer,
            style: MAP_STYLE,
            maxZoom: 20,
            hash: true
        });

        map.on('load', () => {
            addMapControls();
            addMapSourcesAndLayers();
            bindMapEvents();

            if (selectedFeature?.geom?.coordinates) {
                map.flyTo({ center: selectedFeature.geom.coordinates, zoom: 17, speed: 1.2, essential: true });
            }

            fetchFeatures();
        });
    }

    function addMapControls() {
        map.addControl(new NavigationControl());
        
        map.addControl(new GeolocateControl({
            positionOptions: { enableHighAccuracy: true },
            trackUserLocation: true
        }));
    }

    function addMapSourcesAndLayers() {
        map.addSource('osm-data', {
            type: 'geojson',
            data: { type: 'FeatureCollection', features: [] },
            cluster: true,
            clusterMaxZoom: 14,
            clusterRadius: 50
        });

        map.addLayer({
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

        map.addLayer({
            id: 'places-layer-cluster-count',
            type: 'symbol',
            source: 'osm-data',
            filter: ['has', 'point_count'],
            layout: { 'text-field': '{point_count_abbreviated}', 'text-font': ['Noto Sans Regular'], 'text-size': 12 }
        });

        map.addLayer({
            id: 'osm-points',
            type: 'circle',
            source: 'osm-data',
            paint: { 'circle-radius': 5, 'circle-color': '#f00' },
            filter: ['!', ['has', 'point_count']]
        });

        map.addLayer({
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
        map.on('click', 'osm-points', (e) => {
            if (e.features && e.features.length > 0) {
                selectPlace(e.features[0].properties.id);
            }
        });

        map.on('click', (e) => {
            const features = map.queryRenderedFeatures(e.point, { layers: ['osm-points', 'places-layer-clusters'] });

            if (!features.length) {
                selectPlace(null);
            }
        });

        map.on('mouseenter', 'osm-points', () => (map.getCanvas().style.cursor = 'pointer'));
        map.on('mouseleave', 'osm-points', () => (map.getCanvas().style.cursor = ''));

        map.on('click', 'places-layer-clusters', (e) => {
            if (!map || !e.features || e.features.length === 0) {
                return;
            }

            const feature = e.features[0];
            const source = map.getSource('osm-data') as GeoJSONSource;

            source.getClusterExpansionZoom(feature.properties?.cluster_id).then((zoom) => {
                map.flyTo({ center: (feature.geometry as any).coordinates, zoom, speed: 1.2, essential: true });
            });
        });

        map.on('moveend', fetchFeatures);
    }

    async function fetchFeatures() {
        if (!map) {
            return;
        }

        const bounds = map.getBounds();
        const bbox = [
            bounds.getWest().toFixed(5),
            bounds.getSouth().toFixed(5),
            bounds.getEast().toFixed(5),
            bounds.getNorth().toFixed(5)
        ].join(',');

        const params = new URLSearchParams(window.location.search);

        params.set('bbox', bbox);

        try {
            const response = await fetch(`/map-data?${params}`);

            if (response.ok) {
                const data = await response.json();
                const source = map.getSource('osm-data') as GeoJSONSource;

                if (source) {
                    source.setData(data);
                }

                visibleFeatures = data.features.map((feature: any) => ({
                    ...feature.properties
                }));
            }
        } catch (error) {
            console.error('Error fetching map data:', error);
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

            selectedMarker = new Marker({ element: el, anchor: 'bottom', offset: [0, 10] })
                .setLngLat(coords) // <-- Must happen BEFORE addTo(map)
                .addTo(map);
        } else {
            selectedMarker.setLngLat(coords);
        }
    }

    $effect(() => {
        if (map) {
            syncMarker(selectedFeature?.geom?.coordinates);
        }
    });
</script>

<div bind:this={mapContainer} class="h-full w-full"></div>
