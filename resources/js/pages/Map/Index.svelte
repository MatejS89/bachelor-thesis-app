<script lang="ts" module>
    import FullScreenLayout from '@/layouts/FullScreenLayout.svelte';
    import MapLayout from '@/layouts/MapLayout.svelte';

    export const layout = [FullScreenLayout, MapLayout];
</script>

<script lang="ts">
    import { InfiniteScroll, Link, page } from '@inertiajs/svelte';
    import SearchNav from '@/components/SearchNav.svelte';
    import * as Item from '@/components/ui/item/index';
    import * as ToggleGroup from '@/components/ui/toggle-group';
    import { show } from '@/routes/map';
    import { getAppContext } from '@/state/appState.svelte';


    let { visibleFeatures, filters, allergens } = $props();
    let allergenArr = $derived(filters?.allergens ?? []);

    let navigationManager = getAppContext().navigationManager;
    let mapManager = getAppContext().mapManager;

    function filterAllergens(newAllergenArray: string[]) {
        navigationManager.updateAllergens(newAllergenArray);
    }
</script>

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
                <div role="group" aria-roledescription="list-item"
                     onmouseenter={() => mapManager.highlightFeature(feature.id)}
                     onmouseleave={() => mapManager.highlightFeature(null)}>
                    <Link href={show(feature)} data={filters} preserveState class="block">
                        <Item.Root
                            class="justify-start flex gap-4 items-stretch bg-card overflow-hidden p-0 rounded-2xl border-accent hover:border-primary/50 transition-colors"
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
                    </Link>
                </div>
            {/each}
        {:else}
            <p class="p-4 text-gray-500">
                No locations found near you.
            </p>
        {/if}
    </InfiniteScroll>
</div>

