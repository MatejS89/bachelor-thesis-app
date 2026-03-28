<script lang="ts">
    import AppHead from '@/components/AppHead.svelte';
    import MapComponent from '@/components/MapComponent.svelte';
    import MapSidebar from '@/components/MapSidebar.svelte';
    import MapLayout from '@/layouts/MapLayout.svelte';
    import type { MapState } from '@/state/mapState.svelte';
    import { setMapContext } from '@/state/mapState.svelte';

    type OsmDetailData = App.Data.OsmDetailData;

    interface Props {
        selectedFeature?: OsmDetailData;
    }

    let { selectedFeature }: Props = $props();

    let mapContext = $state<MapState>
    ({
        visibleFeatures: { type: 'FeatureCollection', features: [] },
        selectedFeature
    });

    setMapContext(mapContext);

    $effect(() => {
        mapContext.selectedFeature = selectedFeature;
    });
</script>

<AppHead title="Map" />

<MapLayout>
    <div class="flex h-full w-full overflow-hidden">
        <MapSidebar />

        <div class="grow relative h-full">
            <MapComponent {selectedFeature} />
        </div>
    </div>
</MapLayout>
