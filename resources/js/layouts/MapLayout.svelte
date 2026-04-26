<script lang="ts">
    import { page, router, useHttp } from '@inertiajs/svelte';
    import type { FeatureCollection, Point } from 'geojson';
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

    const http = useHttp({
        north: null as number | null,
        south: null as number | null,
        east: null as number | null,
        west: null as number | null,
        allergens: [] as string[]
    });

    function searchThisArea() {
        const currentBounds = mapManager.getBounds();

        if (!currentBounds) {
            return;
        }

        http.north = currentBounds.north;
        http.south = currentBounds.south;
        http.east = currentBounds.east;
        http.west = currentBounds.west;

        http.allergens = page.props.query.allergens;

        http.get('/map-data', {
            onSuccess: (data) => {
                let currentData = data as FeatureCollection<Point>;

                mapManager.setFeatures(currentData);
            }
        });
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

<div class="flex-1 h-dvh w-full grid grid-cols-1 lg:grid-cols-[40%_1fr]">
    <section
        class="col-start-1 row-start-1 flex flex-col min-h-0 w-full h-full border-r lg:overflow-hidden bg-background
               lg:opacity-100 lg:pointer-events-auto
               transition-opacity duration-300 ease-in-out"
        class:opacity-0={showMapOnMobile}
        class:pointer-events-none={showMapOnMobile}
        class:opacity-100={!showMapOnMobile}
    >
        {@render children()}
    </section>

    <aside
        aria-label="Map View"
        class="col-start-1 row-start-1 lg:col-start-2 relative min-h-0 min-w-0 h-full w-full
               lg:opacity-100 lg:pointer-events-auto
               transition-opacity duration-300 ease-in-out"
        class:opacity-0={!showMapOnMobile}
        class:pointer-events-none={!showMapOnMobile}
        class:opacity-100={showMapOnMobile}
    >
        <nav class="absolute top-4 left-4 flex flex-col gap-2 z-10">
            <Button variant="secondary" onclick={searchThisArea}>
                Search this area
            </Button>
            <MapLegend />
        </nav>
        <MapComp />
    </aside>
</div>
