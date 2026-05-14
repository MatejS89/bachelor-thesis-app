<script lang="ts">
    import { Phone } from 'lucide-svelte';
    import { buildContactItems } from '@/lib/osm-tag-format';
    import SectionShell from './SectionShell.svelte';

    let {
        tags
    }: {
        tags: App.Data.OsmData.ParsedOsmTagsData;
    } = $props();

    const items = $derived(buildContactItems(tags));
</script>

{#if items.length > 0}
    <SectionShell icon={Phone} label="Contact">
        {#each items as item (item.key)}
            {@const Icon = item.icon}
            <div
                class="flex items-start gap-3 rounded-md border border-border/60 bg-muted/25 p-3 min-w-0"
            >
                <Icon class="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
                <div class="min-w-0">
                    <p class="text-xs text-muted-foreground">{item.label}</p>
                    <a
                        href={item.href}
                        target={item.href.startsWith('http')
                            ? '_blank'
                            : undefined}
                        rel={item.href.startsWith('http')
                            ? 'noopener noreferrer'
                            : undefined}
                        class="block truncate text-sm font-medium text-primary underline-offset-4 hover:underline"
                    >
                        {item.value}
                    </a>
                </div>
            </div>
        {/each}
    </SectionShell>
{/if}
