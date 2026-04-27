<script lang="ts">
    import { router } from '@inertiajs/svelte';
    import type { Feature } from 'geojson';
    import { Search, MapPin } from 'lucide-svelte';
    import { Button } from '@/components/ui/button';
    import { Input } from '@/components/ui/input';
    import * as Item from '@/components/ui/item/index';
    import { Spinner } from '@/components/ui/spinner';
    import { show } from '@/routes/map';
    import { getAppContext } from '@/state/appState.svelte';
    import getIconForFeature from '@/utils/get-osm_data-icons';

    let { mapManager, searchManager } = getAppContext();

    let showDropdown = $state(false);
    let isSearching = $state(false);

    function submitSearch() {
        handleSearch();
        showDropdown = true;
    }

    async function handleSearch() {
        isSearching = true;

        try {
            const results: Feature[] = await searchManager.search(
                mapManager.userLocation
            );

            if (results && results.length > 0) {
                mapManager.displaySearchResults(results);
            }
        } finally {
            isSearching = false;
        }
    }

    function handleSearchInput(e: KeyboardEvent) {
        if (e.key === 'Enter') {
            submitSearch();
        }
    }

    function selectNominatimResult(feature: Feature) {
        showDropdown = false;
        searchManager.query = feature?.properties?.display_name;

        mapManager.clearSearchResults();

        if (feature.bbox) {
            mapManager.fitToFeatures(feature.bbox);
        } else if (
            feature.geometry?.type === 'Point'
        ) {
            const [lng, lat] = feature.geometry.coordinates;
            mapManager.flyToLocation(lng, lat, 15);
        }
    }

    function selectRestaurantResult(featureId: number) {
        showDropdown = false;

        mapManager.clearSearchResults();

        router.get(show(featureId));
    }
</script>

<nav class="border-b px-3 py-2">
    <div class="relative flex flex-row gap-2">
        <Input
            type="text"
            placeholder="Search for a location or restaurant name..."
            id="search-input"
            bind:value={searchManager.query}
            onkeydown={handleSearchInput}
        />

        <!--{#if searchManager.query.length > 0}-->
        <!--    <button-->
        <!--        type="button"-->
        <!--        class="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground focus:outline-none transition-colors"-->
        <!--        onclick={clearSearch}-->
        <!--        aria-label="Clear search"-->
        <!--    >-->
        <!--        <X class="w-4 h-4" />-->
        <!--    </button>-->
        <!--{/if}-->

        <Button type="button" onclick={submitSearch} variant="secondary" class="shrink-0">
            {#if isSearching}
                <Spinner />
            {:else}
                <Search />
            {/if}
            Search
        </Button>
    </div>

    {#if showDropdown && (searchManager.localResults.length > 0 || searchManager.nominatimResults.length > 0)}
        <div
            class="absolute z-50 mt-1 bg-card border rounded-md shadow-lg max-h-80 overflow-y-auto text-sm flex flex-col w-[calc(100%-2rem)]"
        >
            {#if searchManager.localResults.length > 0}
                <div
                    class="px-3 py-1.5 text-xs font-semibold text-muted-foreground bg-muted/50 sticky top-0 backdrop-blur-sm z-10"
                >
                    Restaurants
                </div>
                <ol class="py-1">
                    {#each searchManager.localResults as feature (feature.id)}
                        {@const FeatureIcon = getIconForFeature(feature)}
                        <Item.Root
                            onclick={() => selectRestaurantResult(feature.id)}
                        >
                            <Item.Media variant="icon">
                                <FeatureIcon></FeatureIcon>
                            </Item.Media>
                            <Item.Content>
                                <Item.Title
                                >{feature?.properties
                                    ?.display_name}</Item.Title
                                >
                            </Item.Content>
                        </Item.Root>
                    {/each}
                </ol>
            {/if}


            {#if searchManager.nominatimResults.length > 0}
                <div
                    class="px-3 py-1.5 text-xs font-semibold text-muted-foreground bg-muted/50 sticky top-0 backdrop-blur-sm z-10"
                >
                    Places Addresses
                </div>
                <ol class="py-1">
                    {#each searchManager.nominatimResults as feature (feature.id)}
                        <button
                            type="button"
                            class="w-full text-left hover:bg-muted/50 transition-colors"
                            onclick={() => selectNominatimResult(feature)}
                        >
                            <Item.Root>
                                <Item.Media variant="icon">
                                    <MapPin />
                                </Item.Media>
                                <Item.Content>
                                    <Item.Title
                                    >{feature?.properties?.name}</Item.Title
                                    >
                                    <Item.Description
                                    >{feature?.properties
                                        ?.secondary_info}</Item.Description
                                    >
                                </Item.Content>
                            </Item.Root>
                        </button>
                    {/each}
                </ol>
            {/if}
        </div>
    {/if}
</nav>
