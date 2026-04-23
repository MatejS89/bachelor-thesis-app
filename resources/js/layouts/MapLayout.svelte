<script lang="ts">
    import { router } from '@inertiajs/svelte';
    import { Map as MapIcon, List as ListIcon } from 'lucide-svelte';
    import AppHead from '@/components/AppHead.svelte';
    import MapComp from '@/components/MapComp.svelte';
    import MapLegend from '@/components/MapLegend.svelte';
    import { Button } from '@/components/ui/button';
    import { MapManager } from '@/hooks/map-manager.svelte';
    import { NavigationManager } from '@/hooks/navigation-manager.svelte';
    import { SearchManager } from '@/hooks/search-result-manager.svelte';
    import { show } from '@/routes/map';
    import { setAppContext } from '@/state/appState.svelte';

    let { children } = $props();

    let showMapOnMobile = $state(false);

    let navigationManager = new NavigationManager();
    let mapManager = new MapManager(navigationManager.updateBounds, showDetail);

    function showDetail(id: number) {
        router.get(show(id), {}, { replace: true });
    }

    setAppContext({
        mapManager,
        navigationManager,
        searchManager: new SearchManager()
    });

    function searchThisArea() {
        const bounds = mapManager.getBounds();

        if (bounds) {
            router.reload({
                data: { ...bounds },
                only: ['visibleFeatures', 'mapFeatures'],
                reset: ['visibleFeatures']
            });
        }
    }
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

<section
    class="flex flex-col min-h-0 w-full lg:static h-full lg:w-2/5 lg:overflow-y-auto {showMapOnMobile ? 'hidden' : 'flex'}"
>
    {@render children()}
</section>

<aside aria-label="Map View" class="flex-1 relative {showMapOnMobile ? 'block' : 'hidden lg:block'}">
    <nav class="absolute top-4 left-4 flex flex-col gap-2">
        <Button variant="secondary" class="z-100" onclick={searchThisArea}>Search this area
        </Button>
        <MapLegend />
    </nav>
    <MapComp class="border-l" />
</aside>
