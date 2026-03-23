<script lang="ts">
    import SidebarDetails from '@/components/SidebarDetails.svelte';
    import SidebarEmpty from '@/components/SidebarEmpty.svelte';
    import SidebarList from '@/components/SidebarList.svelte';

    let { visibleFeatures, selectedFeature, selectPlace } = $props();
</script>

<aside class="w-96 shrink-0 bg-white border-r shadow-lg overflow-y-auto z-10">
    {#if selectedFeature}
        <SidebarDetails {selectedFeature} {selectPlace} />
    {:else if visibleFeatures.length === 0}
        <SidebarEmpty />
    {:else}
        <SidebarList {visibleFeatures} {selectPlace} />
    {/if}
</aside>
