<script lang="ts">
    import { onDestroy, onMount } from 'svelte';
    import 'maplibre-gl/dist/maplibre-gl.css';
    import MapLegend from '@/components/MapLegend.svelte';
    import { Button } from '@/components/ui/button';
    import { Spinner } from '@/components/ui/spinner';
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

    function handleSearchThisArea(e: Event) {
        mapManager.fetchFeaturesForCurrentBounds();
    }
</script>

<section bind:this={mapContainer}
         aria-label="Map View"
         class="relative flex-1 min-h-0 min-w-0
    transition-opacity duration-300 ease-in-out h-dvh"
         class:hidden={isMobile.current && !showMapOnMobile}
>
    <nav class="absolute top-2 left-2 flex flex-col gap-2 z-10">
        <Button variant="secondary" onclick={handleSearchThisArea}>
            {#if mapManager.isProcessing}
                <Spinner />
            {/if}
            Search this area
        </Button>
        <MapLegend />
    </nav>
</section>
