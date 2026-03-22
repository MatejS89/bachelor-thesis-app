<script lang="ts">
    import type { Snippet } from 'svelte';
    import AppHeader from '@/components/AppHeader.svelte';
    import AppShell from '@/components/AppShell.svelte';
    import type { BreadcrumbItem } from '@/types';
    let {
        breadcrumbs = [],
        children,
    }: {
        breadcrumbs?: BreadcrumbItem[];
        children?: Snippet;
    } = $props();
</script>
<AppShell variant="header" class="flex flex-col h-screen overflow-hidden">
    <AppHeader {breadcrumbs} />
    <div class="flex-1 relative w-full h-full overflow-hidden">
         {@render children?.()}
    </div>
</AppShell>
