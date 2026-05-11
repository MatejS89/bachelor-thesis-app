<script lang="ts">
    import { onDestroy, onMount } from 'svelte';
    import 'maplibre-gl/dist/maplibre-gl.css';
    import MapLegend from '@/components/MapLegend.svelte';
    import { Button } from '@/components/ui/button';
    import { Spinner } from '@/components/ui/spinner';
    import { getAppContext } from '@/state/appState.svelte';
    import { IsMobile } from '@/state/is-mobile.svelte.js';

    let { class: className = '' } = $props();

    let mapContainer: HTMLElement;

    let { mapManager, fetchManager, stateManager } = getAppContext();

    onMount(() => {
        requestAnimationFrame(() => mapManager.initialize(mapContainer));
    });

    onDestroy(() => {
        mapManager.destroy();
    });

    let isMobile = $state(new IsMobile());

    function handleSearchThisArea(_: Event) {
        fetchManager.fetchFeaturesForCurrentBounds();
    }
</script>

<section
    bind:this={mapContainer}
    aria-label="Map View"
    class="relative flex-1 min-h-0 min-w-0 h-full max-h-dvh {className}"
    class:hidden={isMobile.current && !stateManager.mapShown}
>
    <nav class="absolute top-2 left-2 flex flex-col gap-2 z-10">
        <Button variant="secondary" onclick={handleSearchThisArea}>
            {#if fetchManager.isProcessing}
                <Spinner />
            {/if}
            Search this area
        </Button>
        <MapLegend />
    </nav>
</section>
