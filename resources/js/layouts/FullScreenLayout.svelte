<script lang="ts">
    import AppContent from '@/components/AppContent.svelte';
    import AppHeader from '@/components/AppHeader.svelte';
    import AppShell from '@/components/AppShell.svelte';

    let { children } = $props();
</script>

<AppShell class="flex h-screen w-full flex-col overflow-hidden text-foreground antialiased">
    <AppHeader />

    <AppContent>
        {@render children?.()}
    </AppContent>
</AppShell>

