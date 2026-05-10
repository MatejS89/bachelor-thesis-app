<script lang="ts">
    import { router } from '@inertiajs/svelte';
    import { Map as MapIcon, List as ListIcon } from 'lucide-svelte';
    import AppHead from '@/components/AppHead.svelte';
    import MapComp from '@/components/MapComp.svelte';
    import { Button } from '@/components/ui/button';
    import { FetchManager } from '@/hooks/fetch-manager.svelte';
    import { MapManager } from '@/hooks/map-manager.svelte';
    import { StateManager } from '@/hooks/state-manager.svelte';
    import { show } from '@/routes/map';
    import { setAppContext } from '@/state/appState.svelte';

    let { children } = $props();


    let mapManager: MapManager;
    let fetchManager: FetchManager;

    const stateManager = new StateManager();

    mapManager = new MapManager(showDetail, () =>
        fetchManager.fetchFeaturesForCurrentBounds()
    );

    fetchManager = new FetchManager(
        () => stateManager.filters,
        () => mapManager.getBounds(),
        () => mapManager.getUserLocation(),
        (data) => mapManager.setFeatures(data)
    );

    function showDetail(id: number) {
        router.get(show(id), {
            ...stateManager.filters
        }, { replace: true });
    }

    setAppContext({
        mapManager,
        stateManager,
        fetchManager
    });
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
