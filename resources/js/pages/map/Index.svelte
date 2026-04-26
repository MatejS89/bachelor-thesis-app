<script lang="ts">
    import { createVirtualizer } from '@tanstack/svelte-virtual';
    import AllergenFilter from '@/components/AllergenFilter.svelte';
    import RestaurantCard from '@/components/RestaurantCard.svelte';
    import SearchNav from '@/components/SearchNav.svelte';
    import { getAppContext } from '@/state/appState.svelte';

    let { allergens } = $props();
    let mapManager = getAppContext().mapManager;

    let features = $derived(mapManager.featureData?.features ?? []);

    let virtualListElement = $state<HTMLElement | null>(null);

    let virtualizer = $derived(
        createVirtualizer<HTMLElement, HTMLLIElement>({
            count: features.length,
            getScrollElement: virtualListElement ? () => virtualListElement : () => null,
            estimateSize: () => 200,
            gap: 10,
            paddingStart: 10,
        })
    );

    let virtualListItemElements: HTMLLIElement[] = $state([]);
    let virtualListItems = $derived($virtualizer.getVirtualItems());

    $effect(() => {
        if (virtualListItemElements.length) {
            virtualListItemElements.forEach((el) => $virtualizer.measureElement(el));
        }
    });
</script>

<nav class="shrink-0 flex flex-col sticky top-0 z-40 bg-background border-b shadow-xs lg:static">
    <SearchNav />
    <AllergenFilter {allergens} />
</nav>

<ol class="h-full w-full overflow-y-auto relative px-2" bind:this={virtualListElement}>
    {#if features.length === 0}
        <p class="p-4 text-gray-500">No locations found near you.</p>
    {:else}
        <div style="height: {$virtualizer.getTotalSize()}px; width: 100%; position: relative;">
            {#each virtualListItems as { index }, virtualListItemArrIndex (index)}
                {@const feature = features[index]}

                <li
                    data-index={index}
                    bind:this={virtualListItemElements[virtualListItemArrIndex]}
                    style="position: absolute; top: 0; left: 0; width: 100%; transform: translateY({virtualListItems[virtualListItemArrIndex].start}px);"
                    onmouseenter={() => mapManager.highlightFeature(feature.id)}
                    onmouseleave={() => mapManager.highlightFeature(null)}
                >
                    <RestaurantCard {feature} />
                </li>
            {/each}
        </div>
    {/if}
</ol>
