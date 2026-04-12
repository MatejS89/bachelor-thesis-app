<script lang="ts" module>
    import FullScreenLayout from '@/layouts/FullScreenLayout.svelte';
    import MapLayout from '@/layouts/MapLayout.svelte';

    export const layout = [FullScreenLayout, MapLayout];
</script>

<script lang="ts">
    import { Link } from '@inertiajs/svelte';

    let { selectedFeature, filters } = $props();
</script>

<div class="flex-1 overflow-y-auto p-4 flex flex-col gap-4">
    <Link
        href="/map"
        data={filters}
        preserveState
        class="text-sm text-muted-foreground hover:text-foreground w-fit"
    >
        &larr; Back to results
    </Link>

    <div class="flex flex-col gap-2 mt-2">
        <h2 class="text-2xl font-bold">{selectedFeature.name}</h2>
    </div>
</div>
