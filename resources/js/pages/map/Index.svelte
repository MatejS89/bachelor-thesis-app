<script lang="ts">
    import { createVirtualizer, createWindowVirtualizer } from '@tanstack/svelte-virtual';
    import AllergenFilter from '@/components/AllergenFilter.svelte';
    import RestaurantCard from '@/components/RestaurantCard.svelte';
    import SearchNav from '@/components/SearchNav.svelte';
    import { IsMobile } from '@/hooks/is-mobile.svelte';
    import { getAppContext } from '@/state/appState.svelte';

    let { allergens } = $props();

    let mapManager = getAppContext().mapManager;
    let features = $derived(mapManager.featureData?.features ?? []);

    let virtualListElement = $state<HTMLElement | null>(null);

    let isMobile = $state(new IsMobile());

    const baseVirtualizerOptions = {
        estimateSize: () => 150,
        gap: 10,
        paddingStart: 10,
        overscan: 30,
    }

    let virtualizer = $derived.by(() => {
        const el = virtualListElement;
        const count = features.length;

        return !isMobile.current
            ? createVirtualizer<HTMLElement, HTMLLIElement>({
                count,
                getScrollElement: () => el,
                ...baseVirtualizerOptions
            })
            : createWindowVirtualizer<HTMLLIElement>({
                count,
                ...baseVirtualizerOptions
            });
    });

    let virtualListItems = $derived($virtualizer.getVirtualItems());
</script>

<nav  class="shrink-0 flex flex-col sticky top-0 z-40 bg-background border-b shadow-xs lg:static">
    <SearchNav />
    <AllergenFilter {allergens} />
</nav>

<ol class="h-full w-full relative px-2 lg:overflow-y-auto will-change-transform" bind:this={virtualListElement} scroll-region="" >
    {#if features.length === 0}
        <p class="p-4 text-gray-500">No locations found near you.</p>
    {:else}
        <div style="height: {$virtualizer.getTotalSize()}px; width: 100%; position: relative;">
            {#each virtualListItems as virtualRow (virtualRow.index)}
                {@const feature = features[virtualRow.index]}
                <li
                    data-index={virtualRow.index}
                    class="absolute top-0 left-0 w-full"
                    style="transform: translateY({virtualRow.start}px);"
                    onmouseenter={() => mapManager.highlightFeature(feature.id)}
                    onmouseleave={() => mapManager.highlightFeature(null)}
                    {@attach (el) => {
                        $virtualizer.measureElement(el);

                        return () => {};
                    }}
                >
                    <RestaurantCard {feature} />
                </li>
            {/each}
        </div>
    {/if}
</ol>
