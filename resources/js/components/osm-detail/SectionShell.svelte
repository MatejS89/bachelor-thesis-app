<script lang="ts">
    import type { Snippet } from 'svelte';
    import type { IconComponent } from '@/lib/osm-tag-format';

    let {
        icon: Icon,
        label,
        gridClass = 'grid gap-2 sm:grid-cols-2',
        children,
    }: {
        icon: IconComponent;
        label: string;
        gridClass?: string;
        children: Snippet;
    } = $props();
</script>

<section class="grid gap-3">
    <h2
        class="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-muted-foreground"
    >
        <Icon class="h-3.5 w-3.5" />
        {label}
    </h2>
    <div class={gridClass}>
        {@render children()}
    </div>
</section>
