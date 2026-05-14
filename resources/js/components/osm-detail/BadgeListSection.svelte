<script lang="ts">
    import { Badge } from '@/components/ui/badge/index.js';
    import type { BadgeItem, IconComponent } from '@/lib/osm-tag-format';
    import SectionShell from './SectionShell.svelte';

    let {
        icon,
        label,
        items,
        variant = 'outline'
    }: {
        icon: IconComponent;
        label: string;
        items: BadgeItem[];
        variant?: 'default' | 'outline' | 'secondary' | 'destructive';
    } = $props();
</script>

{#if items.length > 0}
    <SectionShell {icon} {label} gridClass="flex flex-wrap gap-2">
        {#each items as item (item.key)}
            <Badge {variant}>{item.label}</Badge>
        {/each}
    </SectionShell>
{/if}
