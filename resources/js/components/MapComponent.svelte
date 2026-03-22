<script lang="ts">
    import type { Map as MapLibreMap, GeoJSONSource } from 'maplibre-gl';
    import { Map, NavigationControl, GeolocateControl } from 'maplibre-gl';
    import { onMount } from 'svelte';
    import 'maplibre-gl/dist/maplibre-gl.css';

    let { visibleFeatures = $bindable([]) } = $props();

    let mapContainer: HTMLDivElement;
    let map: MapLibreMap;

    onMount(() => {
        map = new Map({
            container: mapContainer,
            style: 'https://basemaps.cartocdn.com/gl/positron-gl-style/style.json',
            maxZoom: 20,
            hash: true
        });

        map.on('load', () => {
            map.addSource('osm-data', {
                type: 'geojson',
                data: {
                    type: 'FeatureCollection',
                    features: []
                },
                cluster: true,
                clusterMaxZoom: 14,
                clusterRadius: 50
            });

            map.addControl(new NavigationControl());

            map.addControl(
                new GeolocateControl({
                    positionOptions: {
                        enableHighAccuracy: true
                    },
                    trackUserLocation: true
                })
            );

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
                layout: {
                    'text-field': '{point_count_abbreviated}',
                    'text-font': ['Noto Sans Regular'],
                    'text-size': 12
                }
            });

            map.addLayer({
                'id': 'osm-points',
                'type': 'circle',
                'source': 'osm-data',
                'paint': {
                    'circle-radius': 5,
                    'circle-color': '#f00'
                },
                'filter': ['!', ['has', 'point_count']]
            });

            map.addLayer({
                'id': 'osm-points-labels',
                'type': 'symbol',
                'source': 'osm-data',
                'layout': {
                    'text-field': ['get', 'name'],
                    'text-font': ['Noto Sans Regular'],
                    'text-offset': [0, 0.8],
                    'text-anchor': 'top',
                    'text-size': 12,
                    'text-optional': true
                },
                'paint': {
                    'text-color': '#333',
                    'text-halo-color': '#fff',
                    'text-halo-width': 1
                },
                'filter': ['!', ['has', 'point_count']]
            });

            map.on('click', 'places-layer-clusters', (e) => {
                if (!map || !e.features || e.features.length === 0) {
                    return;
                }

                const feature = e.features[0];
                const clusterId = feature.properties?.cluster_id;
                const source = map.getSource('osm-data') as GeoJSONSource;

                source.getClusterExpansionZoom(clusterId).then((zoom) => {
                    map!.easeTo({
                        center: (feature.geometry as any).coordinates,
                        zoom: zoom
                    });
                });
            });

            fetchFeatures();
        });

        map.on('moveend', () => {
            handleMapMove();
        });
    });

    function handleMapMove() {
        fetchFeatures();
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

        const params = new URLSearchParams({ bbox });

        try {
            const response = await fetch(`/map-data?${params}`);

            if (response.ok) {
                const data = await response.json();
                const source = map.getSource('osm-data') as GeoJSONSource;

                if (source) {
                    source.setData(data);
                }

                visibleFeatures = data.features.map((feature: any) => feature.properties);
            }
        } catch (error) {
            console.error('Error fetching map data:', error);
        }
    }
</script>

<div bind:this={mapContainer} class="h-full w-full"></div>

