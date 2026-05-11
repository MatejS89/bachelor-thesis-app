<script lang="ts">
    import {
        createVirtualizer,
        createWindowVirtualizer,
    } from '@tanstack/svelte-virtual';
    import AllergenFilter from '@/components/AllergenFilter.svelte';
    import RestaurantCard from '@/components/RestaurantCard.svelte';
    import SearchNav from '@/components/SearchNav.svelte';
    import * as Empty from '@/components/ui/empty/index';
    import { Spinner } from '@/components/ui/spinner';
    import { IsMobile } from '@/hooks/is-mobile.svelte';
    import { getAppContext } from '@/state/appState.svelte';

    let { allergens } = $props();

    let { mapManager, fetchManager } = getAppContext();
    let features = $derived(fetchManager.featureData?.features ?? []);

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

<nav
    class="shrink-0 top-12 lg:top-0 lg:static flex flex-col sticky z-40 bg-background border-b shadow-xs"
>
    <SearchNav />
    <div class="px-4">
    <AllergenFilter {allergens} />
    </div>
</nav>

<ol
    class="h-full w-full relative px-2 lg:overflow-y-auto will-change-transform bg-sidebar"
    bind:this={virtualListElement}
    scroll-region=""
>
    {#if fetchManager.isProcessing}
        <Spinner class="mx-auto size-8 mt-4" />
    {:else if features.length === 0}
        <Empty.Root>
            <Empty.Content>No restaurants found</Empty.Content>
        </Empty.Root>
    {:else}
        <div
            style="height: {$virtualizer.getTotalSize()}px; width: 100%; position: relative;"
        >
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
