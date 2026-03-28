<script lang="ts">
    import AppHead from '@/components/AppHead.svelte';
    import MapComponent from '@/components/MapComponent.svelte';
    import MapSidebar from '@/components/MapSidebar.svelte';
    import MapLayout from '@/layouts/MapLayout.svelte';
    import { selectPlace } from '@/utils/mapNavigation';

    interface Props {
        selectedFeature?: any;
    }

    let { selectedFeature }: Props = $props();

    let visibleFeatures = $state<any[]>([]);
</script>

<AppHead title="Map" />

<MapLayout>
    <div class="flex h-full w-full overflow-hidden">
        <MapSidebar {visibleFeatures} {selectedFeature} {selectPlace} />

        <div class="grow relative h-full">
            <MapComponent bind:visibleFeatures {selectedFeature} {selectPlace} />
        </div>
    </div>
</MapLayout>
