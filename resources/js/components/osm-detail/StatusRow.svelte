<script lang="ts">
    import { boolIcon } from '@/lib/osm-tag-format';
    import type { StatusItem } from '@/lib/osm-tag-format';

    let { item }: { item: StatusItem } = $props();

    const state = $derived(boolIcon(item.statusValue));
    const StateIcon = $derived(state.icon);
    const ItemIcon = $derived(item.icon);

    const negative = $derived(
        item.value === 'Not available' || item.value === 'Not accepted'
    );
</script>

<div
    class="flex items-center gap-2 rounded-md border border-border/60 bg-muted/25 p-3 text-sm"
>
    <StateIcon class={`h-4 w-4 shrink-0 ${state.className}`} />
    {#if ItemIcon}
        <ItemIcon class="h-4 w-4 shrink-0 text-muted-foreground" />
    {/if}
    <span class="font-medium">{item.label}</span>
    <span
        class={`ml-auto ${negative ? 'text-destructive' : 'text-muted-foreground'}`}
    >
        {item.value}
    </span>
</div>
