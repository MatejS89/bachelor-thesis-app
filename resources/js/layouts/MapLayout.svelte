<script lang="ts">
    import { router } from '@inertiajs/svelte';
    import { Map as MapIcon, List as ListIcon } from 'lucide-svelte';
    import AppHead from '@/components/AppHead.svelte';
    import MapComp from '@/components/MapComp.svelte';
    import { Button } from '@/components/ui/button';
    import { MapManager } from '@/hooks/map-manager.svelte';
    import { NavigationManager } from '@/hooks/navigation-manager.svelte';
    import { SearchManager } from '@/hooks/search-result-manager.svelte';
    import { show } from '@/routes/map';
    import { setAppContext } from '@/state/appState.svelte';

    let { children } = $props();

    let showMapOnMobile = $state(false);

    let navigationManager = new NavigationManager();
    let mapManager = new MapManager(showDetail);

    function showDetail(id: number) {
        router.get(show(id), {}, { replace: true });
    }

    setAppContext({
        mapManager,
        navigationManager,
        searchManager: new SearchManager()
    });
</script>

<AppHead title="Map" />

<Button
    class="fixed bottom-4 right-4 z-50 rounded-full shadow-lg lg:hidden gap-2 touch-manipulation"
    onclick={() => (showMapOnMobile = !showMapOnMobile)}
>
    {#if showMapOnMobile}
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
        class:pointer-events-none={showMapOnMobile}
        class:hidden={showMapOnMobile}
    >
        {@render children()}
    </section>

    <MapComp bind:showMapOnMobile={showMapOnMobile} />
</div>
