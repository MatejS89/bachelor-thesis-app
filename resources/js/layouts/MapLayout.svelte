<script lang="ts">
    import { Map as MapIcon, List as ListIcon } from 'lucide-svelte';
    import AppHead from '@/components/AppHead.svelte';
    import MapComp from '@/components/MapComp.svelte';
    import { Button } from '@/components/ui/button';
    import { MapManager } from '@/hooks/map-manager.svelte';
    import { NavigationManager } from '@/hooks/navigation-manager.svelte';
    import { SearchManager } from '@/hooks/search-result-manager.svelte';
    import { setAppContext } from '@/state/appState.svelte';

    let { children } = $props();

    let showMapOnMobile = $state(false);

    let navigationManager = new NavigationManager();
    setAppContext({
        mapManager: new MapManager(navigationManager.updateBounds),
        navigationManager,
        searchManager: new SearchManager()
    });
</script>

<AppHead title="Map" />

<Button
    class="absolute bottom-6 right-6 z-50 rounded-full shadow-lg lg:hidden gap-2"
    onclick={() => (showMapOnMobile = !showMapOnMobile)}
>
    {#if showMapOnMobile}
        <ListIcon class="w-4 h-4" />
        Show List
    {:else}
        <MapIcon class="w-4 h-4" />
        Show Map
    {/if}
</Button>

<div class="flex w-full h-screen overflow-hidden">
    <section
        class="absolute inset-y-0 left-0 z-10 flex flex-col w-full lg:static lg:w-[50%] lg:shadow-none lg:border-r bg-background {showMapOnMobile ? 'hidden' : 'flex'}"
    >
        {@render children()}
    </section>

    <div class="flex-1 relative flex w-full h-full">
        <MapComp class="absolute inset-0 w-full h-full" />
    </div>
</div>
