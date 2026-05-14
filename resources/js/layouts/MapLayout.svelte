<script lang="ts">
    import { router } from '@inertiajs/svelte';
    import { Map as MapIcon, List as ListIcon } from 'lucide-svelte';
    import AppHead from '@/components/AppHead.svelte';
    import MapComp from '@/components/MapComp.svelte';
    import { Button } from '@/components/ui/button';
    import { show } from '@/routes/map';
    import { setAppContext } from '@/state/appState.svelte';
    import { FetchManager } from '@/state/fetch-manager.svelte.js';
    import { MapManager } from '@/state/map-manager.svelte.js';
    import { StateManager } from '@/state/state-manager.svelte.js';

    let { children } = $props();

    function showDetail(id: number) {
        router.get(show(id), { ...stateManager.filters }, { replace: true });
    }

    const stateManager = new StateManager();

    const mapManager = new MapManager({
        stateManager,
        onFeatureClick: showDetail,
        triggerFetch: () => fetchManager.fetchFeaturesForCurrentBounds(),
    });

    const fetchManager = new FetchManager({
        stateManager,
        onSuccess: (data) => mapManager.setFeatures(data),
    });

    setAppContext({ mapManager, stateManager, fetchManager });
</script>

<AppHead title="Map" />

<Button
    size="lg"
    class="fixed bottom-8 right-4 z-50 rounded-full shadow-lg lg:hidden gap-2 touch-manipulation"
    onclick={() => (stateManager.mapShown = !stateManager.mapShown)}
>
    {#if stateManager.mapShown}
        <ListIcon />
        List
    {:else}
        <MapIcon />
        Map
    {/if}
</Button>

<div class="w-full flex flex-row lg:overflow-hidden">
    <section
        class="flex flex-col lg:max-w-2/5 h-full flex-1 w-full border-r bg-background
               lg:opacity-100 lg:pointer-events-auto
               transition-opacity duration-300 ease-in-out"
        class:pointer-events-none={stateManager.mapShown}
        class:hidden={stateManager.mapShown}
    >
        {@render children()}
    </section>

    <MapComp />
</div>
