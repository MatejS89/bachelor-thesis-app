<script lang="ts">
    import { Clock } from 'lucide-svelte';
    import OpeningBadge from '@/components/OpeningBadge.svelte';
    import { parseHours } from '@/lib/osm-tag-format';
    import type { HoursEntry } from '@/lib/osm-tag-format';

    let {
        tags
    }: {
        tags: App.Data.OsmData.ParsedOsmTagsData;
    } = $props();

    const main = $derived(
        tags.opening_hours ? parseHours(tags.opening_hours) : []
    );
    const breakfast = $derived(
        tags.other.breakfast && tags.other.breakfast.includes(':')
            ? parseHours(tags.other.breakfast)
            : []
    );
    const happy = $derived(
        tags.other.happy_hours && tags.other.happy_hours.includes(':')
            ? parseHours(tags.other.happy_hours)
            : []
    );
</script>

{#snippet hoursList(hours: HoursEntry[])}
    <div class="space-y-1.5 rounded-md bg-muted/30 p-3">
        {#each hours as { days, times, isOff } (days + times)}
            <div class="flex justify-between gap-4 text-sm">
                <span class="font-medium text-foreground">{days}</span>
                <span
                    class={isOff
                        ? 'text-destructive'
                        : 'text-muted-foreground text-right'}
                >
                    {times}
                </span>
            </div>
        {/each}
    </div>
{/snippet}

<section class="grid gap-3">
    <div class="flex flex-wrap items-center justify-between gap-2">
        <h2
            class="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-muted-foreground"
        >
            <Clock class="h-3.5 w-3.5" />
            Hours
        </h2>
        <OpeningBadge hoursString={tags.opening_hours ?? undefined} />
    </div>

    {#if main.length > 0}
        {@render hoursList(main)}
    {:else}
        <p class="text-sm text-muted-foreground">Hours not available</p>
    {/if}

    {#if breakfast.length > 0 || happy.length > 0}
        <div class="grid gap-3 sm:grid-cols-2">
            {#if breakfast.length > 0}
                <div class="grid gap-2">
                    <p class="text-xs font-medium text-muted-foreground">
                        Breakfast
                    </p>
                    {@render hoursList(breakfast)}
                </div>
            {/if}

            {#if happy.length > 0}
                <div class="grid gap-2">
                    <p class="text-xs font-medium text-muted-foreground">
                        Happy hours
                    </p>
                    {@render hoursList(happy)}
                </div>
            {/if}
        </div>
    {/if}
</section>
