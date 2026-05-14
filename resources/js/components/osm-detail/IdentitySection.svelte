<script lang="ts">
    import { Info } from 'lucide-svelte';
    import { buildIdentityItems } from '@/lib/osm-tag-format';
    import SectionShell from './SectionShell.svelte';

    let {
        tags
    }: {
        tags: App.Data.OsmData.ParsedOsmTagsData;
    } = $props();

    const items = $derived(buildIdentityItems(tags));
    const fullAddress = $derived(tags.address.full);
    const visible = $derived(items.length > 0 || Boolean(fullAddress));
</script>

{#if visible}
    <SectionShell icon={Info} label="Identity">
        {#each items as item (item.label)}
            <div
                class="flex items-start justify-between gap-3 rounded-md border border-border/60 bg-muted/25 p-3 min-w-0"
            >
                <p class="text-sm text-muted-foreground shrink-0">
                    {item.label}
                </p>
                <p
                    class="text-right text-sm font-medium text-foreground wrap-break-word min-w-0"
                >
                    {item.value}
                </p>
            </div>
        {/each}

        {#if fullAddress}
            <div
                class="rounded-md border border-border/60 bg-muted/25 p-3 sm:col-span-2 min-w-0"
            >
                <p class="text-sm text-muted-foreground">Address</p>
                <p class="text-sm font-medium text-foreground break-words">
                    {fullAddress}
                </p>
            </div>
        {/if}
    </SectionShell>
{/if}
