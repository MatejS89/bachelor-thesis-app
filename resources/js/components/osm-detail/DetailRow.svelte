<script lang="ts">
    import type { DetailItem } from '@/lib/osm-tag-format';

    let { item }: { item: DetailItem } = $props();
    const Icon = $derived(item.icon);
</script>

<div
    class="flex items-start gap-3 rounded-md border border-border/60 bg-muted/25 p-3 min-w-0"
>
    <Icon class="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
    <div class="min-w-0 flex-1">
        <div class="flex items-start justify-between gap-3 min-w-0">
            <p class="text-sm font-medium text-foreground">{item.label}</p>
            {#if item.value}
                <p
                    class="text-sm text-muted-foreground text-right wrap-break-word min-w-0"
                >
                    {item.value}
                </p>
            {/if}
        </div>
        {#if item.note}
            <p class="mt-1 text-xs text-muted-foreground">{item.note}</p>
        {/if}
    </div>
</div>
