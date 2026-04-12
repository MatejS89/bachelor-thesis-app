<script lang="ts">
    import { InfiniteScroll } from '@inertiajs/svelte';
    import { Map as MapIcon, List as ListIcon } from 'lucide-svelte';
    import AppHead from '@/components/AppHead.svelte';
    import MapComp from '@/components/MapComp.svelte';
    import SearchNav from '@/components/SearchNav.svelte';
    import { Button } from '@/components/ui/button';
    import * as Item from '@/components/ui/item/index';
    import * as ToggleGroup from '@/components/ui/toggle-group';
    import { MapManager } from '@/hooks/map-manager.svelte';
    import { NavigationManager } from '@/hooks/navigation-manager.svelte';
    import { SearchManager } from '@/hooks/search-result-manager.svelte';
    import { setAppContext } from '@/state/appState.svelte';

    interface MapPageProps {
        visibleFeatures: {
            data: any[];
        };
        filters: {
            allergens?: string[];
            [key: string]: any
        };
        allergens: any[];
    }

    let { visibleFeatures, filters, allergens }: MapPageProps = $props();

    let showMapOnMobile = $state(false);

    let allergenArr = $derived(filters?.allergens ?? []);

    let navigationManager = new NavigationManager();

    setAppContext({
        mapManager: new MapManager(navigationManager.updateBounds),
        searchManager: new SearchManager(),
        navigationManager
    });

    function filterAllergens(newAllergenArray: string[]) {
        navigationManager.updateAllergens(newAllergenArray);
    }
</script>

<AppHead title="Map" />

<div class="flex flex-1 flex-row w-full h-full relative overflow-hidden">
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
        class="absolute inset-y-0 left-0 z-10 flex flex-col w-full lg:static lg:w-[50%] lg:shadow-none bg-background
                       {showMapOnMobile ? 'hidden' : 'flex'}"
    >
        <nav>
            <SearchNav />

            <ToggleGroup.Root
                type="multiple"
                bind:value={allergenArr}
                onValueChange={filterAllergens}
                spacing={2}
                class="flex flex-wrap p-3"
                variant="outline"
            >
                {#each allergens as allergen (allergen.name)}
                    <ToggleGroup.Item
                        value={allergen.name}
                        aria-label="Toggle {allergen.name}"
                        class="data-[state=on]:bg-primary data-[state=on]:text-primary-foreground hover:data-[state=on]:bg-primary/90"
                    >
                        {allergen.name}
                    </ToggleGroup.Item>
                {/each}
            </ToggleGroup.Root>
        </nav>

        <div class="overflow-y-auto flex-1 p-4" scroll-region="visibleFeatures">
            <InfiniteScroll
                data="visibleFeatures"
                as="ol"
                class="flex flex-col gap-4"
            >
                {#if visibleFeatures.data.length > 0}
                    {#each visibleFeatures.data as feature (feature.id)}
                        <Item.Root
                            class="justify-start flex gap-4 items-stretch bg-card overflow-hidden p-0 rounded-2xl border-accent"
                        >
                            <img
                                src="/400.svg"
                                class="object-cover aspect-square max-h-70"
                                alt="thumbnail"
                            />

                            <Item.Content
                                class="flex flex-1 flex-col justify-center"
                            >
                                <Item.Title class="text-base font-semibold">
                                    {feature.name || 'Unnamed location'}
                                </Item.Title>

                                <Item.Description
                                    class="flex flex-col gap-0.5 mt-1 text-sm"
                                >
                                    <span>Total menu items: {feature?.total_items_count}</span>
                                    <span>Safe menu items: {feature?.safe_items_count}</span>
                                </Item.Description>
                            </Item.Content>
                        </Item.Root>
                    {/each}
                {:else}
                    <p class="p-4 text-gray-500">
                        No locations found near you.
                    </p>
                {/if}
            </InfiniteScroll>
        </div>
    </section>

    <div class="flex-1 relative flex w-full h-full min-h-[50vh]">
        <MapComp class="absolute inset-0 w-full h-full" />
    </div>
</div>
