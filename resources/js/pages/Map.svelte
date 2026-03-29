<script lang="ts">
    import AppHead from '@/components/AppHead.svelte';
    import AppHeader from '@/components/AppHeader.svelte';
    import MapComponent from '@/components/MapComponent.svelte';
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
        get selectedFeature() {
            return selectedFeature;
        }
    });

    setMapContext(mapContext);
</script>

<AppHead title="Map" />

<div class="flex h-dvh flex-col">
    <AppHeader />
    <main class="flex flex-1 h-full w-full overflow-hidden">
        <!--        <section>-->
        <!--            <MapSidebar />-->
        <!--        </section>-->

        <section class="grow relative h-full">
            <MapComponent {selectedFeature} />
        </section>
    </main>
</div>
