<script lang="ts">
    import AppContent from '@/components/AppContent.svelte';
    import AppHeader from '@/components/AppHeader.svelte';
    import AppShell from '@/components/AppShell.svelte';

    let { children } = $props();
</script>

<AppShell class="text-foreground flex-col">
    <AppHeader />

    <AppContent class="flex-row">
        {@render children?.()}
    </AppContent>
</AppShell>
