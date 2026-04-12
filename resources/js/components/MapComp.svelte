<script lang="ts">
    import { page } from '@inertiajs/svelte';
    import { onDestroy, onMount } from 'svelte';
    import 'maplibre-gl/dist/maplibre-gl.css';
    import type { MapManager } from '@/hooks/map-manager.svelte';
    import { getAppContext } from '@/state/appState.svelte';

    let { class: className } = $props();

    let mapContainer: HTMLElement;

    let mapManager: MapManager = getAppContext().mapManager;

    onMount(() => {
        mapManager.initialize(
            mapContainer);
    });

    $effect(() => {
        const mapFeatures = page.props.mapFeatures;

        if (mapFeatures) {
            mapManager.setFeatures(mapFeatures.data ?? mapFeatures);
        }
    });

    onDestroy(() => {
        mapManager.destroy();
    });
</script>

<section bind:this={mapContainer} class="{className}">
</section>
