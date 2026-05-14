<script lang="ts">
    import { Info } from 'lucide-svelte';
    import { buildNoteItems } from '@/lib/osm-tag-format';
    import SectionShell from './SectionShell.svelte';

    let {
        tags
    }: {
        tags: App.Data.OsmData.ParsedOsmTagsData;
    } = $props();

    const notes = $derived(buildNoteItems(tags));
</script>

{#if notes.length > 0}
    <SectionShell icon={Info} label="Notes" gridClass="grid gap-2">
        {#each notes as note (note)}
            <p
                class="rounded-md border border-border/60 bg-muted/25 p-3 text-sm text-muted-foreground"
            >
                {note}
            </p>
        {/each}
    </SectionShell>
{/if}
