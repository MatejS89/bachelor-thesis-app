<script lang="ts">
    import { router } from '@inertiajs/svelte';
    import type { Feature } from 'geojson';
    import { MapPin, Navigation, SearchX } from 'lucide-svelte';
    import * as Command from '@/components/ui/command/index';
    import { Spinner } from '@/components/ui/spinner';
    import { show } from '@/routes/map';
    import { getAppContext } from '@/state/appState.svelte';
    import { SearchManager } from '@/state/search-result-manager.svelte.js';
    import getIconForFeature from '@/utils/get-osm_data-icons';

    const DEBOUNCE_MS = 300;

    let { mapManager } = getAppContext();

    let containerEl: HTMLElement;
    let commandInputRef: HTMLInputElement | null = $state(null);
    let debounceTimer: ReturnType<typeof setTimeout> | null = null;
    let suppressNextSearch = false;

    $effect(() => {
        const input = commandInputRef;

        if (!input) {
            return;
        }

        const label = input
            .closest('[data-slot="command"]')
            ?.querySelector<HTMLLabelElement>('[data-command-input-label]');

        if (label && !label.htmlFor) {
            label.htmlFor = input.id;
        }
    });

    let searchManager = new SearchManager();

    const hasResults = $derived(
        searchManager.localResults.length > 0 ||
        searchManager.nominatimResults.length > 0
    );

    const trimmedQuery = $derived(searchManager.query.trim());

    $effect(() => {
        const q = searchManager.query;

        if (suppressNextSearch) {
            suppressNextSearch = false;

            return;
        }

        if (debounceTimer) {
            clearTimeout(debounceTimer);
        }

        if (!q.trim()) {
            searchManager.localResults = [];
            searchManager.nominatimResults = [];

            return;
        }

        debounceTimer = setTimeout(() => {
            runSearch();
        }, DEBOUNCE_MS);
    });

    $effect(() => {
        function handleClick(e: MouseEvent) {
            if (containerEl && !containerEl.contains(e.target as Node)) {
                searchManager.showDropdown = false;
            }
        }

        document.addEventListener('mousedown', handleClick);

        return () => {
            document.removeEventListener('mousedown', handleClick);
        };
    });

    async function runSearch() {
        if (!searchManager.query.trim()) {
            return;
        }

        await searchManager.search(mapManager.userLocation);

        searchManager.showDropdown = true;
    }

    async function commitSearchToMap() {
        if (debounceTimer) {
            clearTimeout(debounceTimer);
            debounceTimer = null;
        }

        searchManager.showDropdown = true;
    }

    function handleKeydown(e: KeyboardEvent) {
        if (e.key === 'Enter') {
            e.preventDefault();
            commitSearchToMap();
        } else if (e.key === 'Escape') {
            searchManager.showDropdown = false;
        }
    }

    function selectAddressResult(feature: Feature) {
        suppressNextSearch = true;
        searchManager.query = feature?.properties?.display_name ?? '';
        searchManager.showDropdown = false;

        if (feature.bbox) {
            mapManager.fitToFeatures(feature.bbox);
        } else if (feature.geometry?.type === 'Point') {
            const [lng, lat] = feature.geometry.coordinates;
            mapManager.flyToLocation(lng, lat, 15);
        }
    }

    function selectRestaurantResult(feature: Feature) {
        searchManager.showDropdown = false;

        if (feature.geometry?.type === 'Point') {
            const [lng, lat] = feature.geometry.coordinates;
            mapManager.flyToLocation(lng, lat, 16);
        }

        router.get(show(feature.id as number));
    }

    function selectCurrentLocation() {
        searchManager.showDropdown = false;
        mapManager.triggerGeolocation();
    }
</script>

<nav bind:this={containerEl} class="border-b px-3 py-2 relative">
    <Command.Root
        shouldFilter={false}
        class="bg-transparent rounded-none p-0 overflow-visible h-auto"
    >
        <div class="relative">
            <Command.Input
                class="text-base"
                bind:ref={commandInputRef}
                bind:value={searchManager.query}
                placeholder="Search for a location or restaurant name..."
                onkeydown={handleKeydown}
                onfocus={() => (searchManager.showDropdown = true)}
            />
        </div>

        {#if searchManager.showDropdown}
            <div
                class="absolute top-full left-3 right-3 mt-1 bg-popover border rounded-md shadow-lg z-50 overflow-hidden"
            >
                <Command.List>
                    <Command.Group>
                        <Command.Item
                            value="current-location"
                            onSelect={selectCurrentLocation}
                        >
                            <Navigation class="text-primary" />
                            <span class="font-medium text-primary">
                                Current Location
                            </span>
                        </Command.Item>
                    </Command.Group>

                    {#if trimmedQuery.length > 0}
                        <Command.Separator />

                        {#if searchManager.isSearching && !hasResults}
                            <Command.Loading>
                                <div
                                    class="flex items-center justify-center gap-2 py-6 text-sm text-muted-foreground"
                                >
                                    <Spinner />
                                    Searching...
                                </div>
                            </Command.Loading>
                        {:else if !hasResults}
                            <div
                                class="flex flex-col items-center gap-1 py-6 text-muted-foreground"
                            >
                                <SearchX class="size-5" />
                                <span class="text-sm">No results</span>
                            </div>
                        {:else}
                            {#if searchManager.localResults.length > 0}
                                <Command.Group heading="Restaurants">
                                    {#each searchManager.localResults as feature (feature.id)}
                                        {@const FeatureIcon =
                                            getIconForFeature(feature)}
                                        <Command.Item
                                            value={`local-${feature.id}`}
                                            onSelect={() =>
                                                selectRestaurantResult(feature)}
                                        >
                                            <FeatureIcon />
                                            <span class="truncate">
                                                {feature?.properties
                                                    ?.display_name}
                                            </span>
                                        </Command.Item>
                                    {/each}
                                </Command.Group>
                            {/if}

                            {#if searchManager.localResults.length > 0 && searchManager.nominatimResults.length > 0}
                                <Command.Separator />
                            {/if}

                            {#if searchManager.nominatimResults.length > 0}
                                <Command.Group heading="Addresses">
                                    {#each searchManager.nominatimResults as feature (feature.id)}
                                        <Command.Item
                                            value={`addr-${feature.id}`}
                                            onSelect={() =>
                                                selectAddressResult(feature)}
                                        >
                                            <MapPin />
                                            <div
                                                class="flex flex-col min-w-0 flex-1"
                                            >
                                                <span class="truncate">
                                                    {feature?.properties?.name}
                                                </span>
                                                <span
                                                    class="truncate text-xs text-muted-foreground"
                                                >
                                                    {feature?.properties
                                                        ?.secondary_info}
                                                </span>
                                            </div>
                                        </Command.Item>
                                    {/each}
                                </Command.Group>
                            {/if}
                        {/if}
                    {/if}
                </Command.List>
            </div>
        {/if}
    </Command.Root>
</nav>
