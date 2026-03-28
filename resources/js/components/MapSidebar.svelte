<script lang="ts">
    import SidebarDetails from '@/components/SidebarDetails.svelte';
    import SidebarEmpty from '@/components/SidebarEmpty.svelte';
    import SidebarList from '@/components/SidebarList.svelte';
    import { getMapContext } from '@/state/mapState.svelte';

    const mapContext = getMapContext();

    const selectedFeature = $derived(mapContext.selectedFeature);
    const visibleFeatures = $derived(mapContext.visibleFeatures);
</script>

<aside class="w-96 shrink-0 bg-white border-r shadow-lg overflow-y-auto z-10">
    {#if selectedFeature}
        <SidebarDetails {selectedFeature} />
    {:else if visibleFeatures?.features?.length === 0}
        <SidebarEmpty />
    {:else}
        <SidebarList {visibleFeatures} />
    {/if}
</aside>
