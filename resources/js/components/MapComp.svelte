<script lang="ts">
    import { onDestroy, onMount } from 'svelte';
    import 'maplibre-gl/dist/maplibre-gl.css';
    import MapLegend from '@/components/MapLegend.svelte';
    import { Button } from '@/components/ui/button';
    import { IsMobile } from '@/hooks/is-mobile.svelte';
    import type { MapManager } from '@/hooks/map-manager.svelte';
    import { getAppContext } from '@/state/appState.svelte';

    let { showMapOnMobile = $bindable(), class: className = '' } = $props();

    let mapContainer: HTMLElement;

    let mapManager: MapManager = getAppContext().mapManager;

    onMount(() => {
        mapManager.initialize(
            mapContainer);
    });

    onDestroy(() => {
        mapManager.destroy();
    });

    let isMobile = $state(new IsMobile());
</script>

<section bind:this={mapContainer}
         aria-label="Map View"
         class="relative flex-1 min-h-0 min-w-0
    transition-opacity duration-300 ease-in-out max-h-dvh"
         class:hidden={isMobile.current && !showMapOnMobile}
>
    <nav class="absolute top-4 left-4 flex flex-col gap-2 z-10">
        <Button variant="secondary" onclick={mapManager.fetchFeaturesForCurrentBounds}>
            Search this area
        </Button>
        <MapLegend />
    </nav>
</section>
