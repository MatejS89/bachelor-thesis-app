<script lang="ts">
    import { Star, UtensilsCrossed } from 'lucide-svelte';
    import { Badge } from '@/components/ui/badge/index.js';
    import {
        buildDietItems,
        formatTagValue,
        getAmenityIcon,
        humanize
    } from '@/lib/osm-tag-format';
    import type { TagValue } from '@/lib/osm-tag-format';
    import StatusRow from './StatusRow.svelte';

    let {
        type,
        tags
    }: {
        type: TagValue;
        tags: App.Data.OsmData.ParsedOsmTagsData;
    } = $props();

    const amenityType = $derived(type ?? tags.other.amenity);
    const AmenityIcon = $derived(getAmenityIcon(amenityType));

    const dietItems = $derived(buildDietItems(tags));

    const hasBadges = $derived(
        Boolean(
            amenityType ||
            tags.cuisine.length > 0 ||
            tags.other.stars ||
            tags.other.michelin_guide
        )
    );

    const visible = $derived(hasBadges || dietItems.length > 0);
</script>

{#if visible}
    <section class="grid gap-3">
        <h2
            class="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-muted-foreground"
        >
            <UtensilsCrossed class="h-3.5 w-3.5" />
            Details
        </h2>

        {#if hasBadges}
            <div class="flex flex-row flex-wrap gap-1.5">
                {#if amenityType}
                    <Badge variant="outline" class="gap-1 capitalize">
                        <AmenityIcon class="h-3 w-3" />
                        {humanize(amenityType)}
                    </Badge>
                {/if}

                {#each tags.cuisine as cuisine (cuisine)}
                    <Badge variant="secondary" class="capitalize">
                        {humanize(cuisine)}
                    </Badge>
                {/each}

                {#if tags.other.stars}
                    <Badge variant="outline" class="gap-1">
                        <Star class="h-3 w-3 fill-amber-400 text-amber-400" />
                        {tags.other.stars} stars
                    </Badge>
                {/if}

                {#if tags.other.michelin_guide}
                    <Badge
                        variant="outline"
                        class="border-red-500/40 text-red-700 dark:text-red-300"
                    >
                        Michelin {formatTagValue(tags.other.michelin_guide)}
                    </Badge>
                {/if}
            </div>
        {/if}

        {#if dietItems.length > 0}
            <div class="grid gap-2 sm:grid-cols-2">
                {#each dietItems as item (item.key)}
                    <StatusRow {item} />
                {/each}
            </div>
        {/if}
    </section>
{/if}
