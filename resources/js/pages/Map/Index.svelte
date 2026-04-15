<script lang="ts" module>
    import FullScreenLayout from '@/layouts/FullScreenLayout.svelte';
    import MapLayout from '@/layouts/MapLayout.svelte';

    export const layout = [FullScreenLayout, MapLayout];
</script>

<script lang="ts">
    import { InfiniteScroll } from '@inertiajs/svelte';
    import AllergenFilter from '@/components/AllergenFilter.svelte';
    import RestaurantCard from '@/components/RestaurantCard.svelte';
    import SearchNav from '@/components/SearchNav.svelte';
    import { getAppContext } from '@/state/appState.svelte';

    let { visibleFeatures, filters, allergens, mapFeatures } = $props();

    let mapManager = getAppContext().mapManager;

    let featureStatsMap = $derived(
        new Map(
            (mapFeatures?.data?.features ?? []).map((feature: any) => [
                feature.id ?? feature.properties?.id,
                {
                    total_items_count: feature.total_items_count ?? feature.properties?.total_items_count,
                    safe_items_count: feature.safe_items_count ?? feature.properties?.safe_items_count
                }
            ])
        )
    );

    $effect(() => {
        const featuresCollection = mapFeatures?.data;

        if (featuresCollection) {
            mapManager.setFeatures(featuresCollection);
        }
    });
</script>

<nav class="shrink-0">
    <SearchNav />
    <AllergenFilter {allergens} {filters} />
</nav>

<div class="overflow-y-auto flex-1 p-4 min-h-0" scroll-region="visibleFeatures">
    <InfiniteScroll
        data="visibleFeatures"
        as="ol"
        class="flex flex-col gap-4"
    >
        {#if visibleFeatures.data.length > 0}
            {#each visibleFeatures.data as feature (feature.id)}
                <RestaurantCard
                    {feature}
                    {filters}
                    stats={featureStatsMap.get(feature.id)}
                />
            {/each}
        {:else}
            <p class="p-4 text-gray-500">
                No locations found near you.
            </p>
        {/if}
    </InfiniteScroll>
</div>
