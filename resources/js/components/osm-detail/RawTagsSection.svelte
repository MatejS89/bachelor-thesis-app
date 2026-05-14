<script lang="ts">
    import { Hash } from 'lucide-svelte';
    import { buildRawTagEntries } from '@/lib/osm-tag-format';

    let {
        tags,
    }: {
        tags: App.Data.OsmData.ParsedOsmTagsData;
    } = $props();

    const entries = $derived(buildRawTagEntries(tags));
</script>

<details class="group w-full">
    <summary
        class="flex cursor-pointer list-none items-center gap-1.5 text-xs font-semibold uppercase tracking-widest text-muted-foreground transition-colors hover:text-foreground"
    >
        <Hash class="h-3.5 w-3.5" />
        All OSM Tags ({entries.length})

        <span class="ml-auto text-xs font-normal normal-case group-open:hidden">
            Show
        </span>
        <span
            class="ml-auto hidden text-xs font-normal normal-case group-open:inline"
        >
            Hide
        </span>
    </summary>

    <div class="pt-3 font-mono text-xs">
        {#each entries as [key, value] (key)}
            <div
                class="grid grid-cols-[minmax(8rem,12rem)_1fr] gap-3 border-b border-border/30 py-1 last:border-0"
            >
                <span class="truncate text-muted-foreground">{key}</span>
                <span class="break-all text-foreground">{value}</span>
            </div>
        {/each}
    </div>
</details>
