<script lang="ts">
    import { page, router } from '@inertiajs/svelte';
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
    let mapManager = new MapManager(navigationManager.updateBounds);

    setAppContext({
        mapManager,
        navigationManager,
        searchManager: new SearchManager()
    });

    function searchThisArea() {
        const bounds = mapManager.getBounds();

        if (bounds) {
            router.reload({
                data: { ...page.props.filters, ...bounds },
                only: ['visibleFeatures', 'mapFeatures'],
                reset: ['visibleFeatures']
            });
        }
    }
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

<section
    class="overflow-hidden flex-col min-h-0 lg:static lg:w-[50%] {showMapOnMobile ? 'hidden' : 'flex'}"
>
    {@render children()}
</section>

<div class="flex-1 relative {showMapOnMobile ? 'block' : 'hidden lg:block'}">
    <Button variant="secondary" class="absolute z-100 left-4 top-4" onclick={searchThisArea}>Search this area
    </Button>

    <MapComp class="w-full h-full" />
</div>
