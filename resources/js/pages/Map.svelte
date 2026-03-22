<script lang="ts">
    import AppHead from '@/components/AppHead.svelte';
    import MapComponent from '@/components/MapComponent.svelte';
    import MapLayout from '@/layouts/MapLayout.svelte';
    import type { BreadcrumbItem } from '@/types';

    let visibleFeatures = $state<any[]>([]);

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Map',
            href: '/map'
        }
    ];
</script>

<AppHead title="Map" />

<MapLayout {breadcrumbs}>
    <div class="flex h-full w-full overflow-hidden">
        <div class="w-96 shrink-0 bg-white border-r shadow-lg overflow-y-auto z-10">
            {#if visibleFeatures.length === 0}
                <div class="p-8 text-center text-gray-500">
                    <p>No restaurants found in this area.</p>
                    <p class="text-sm mt-2">Try moving the map.</p>
                </div>
            {:else}
                <div class="p-4 border-b bg-gray-50">
                    <h2 class="text-xl font-bold text-gray-800">Restaurants</h2>
                    <p class="text-sm text-gray-500 mt-1">Found {visibleFeatures.length} places in view</p>
                </div>
                <div class="divide-y">
                    {#each visibleFeatures as place (place.id || place.osm_id)}
                        <div class="p-4 hover:bg-gray-50 transition-colors text-gray-600">
                            <h3 class="font-semibold text-lg text-gray-800">{place.name || 'Unnamed Place'}</h3>
                            {#if place.cuisine}
                                <div class="flex items-center mt-1">
                                    <span
                                        class="inline-block px-2 py-0.5 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                                        {place.cuisine}
                                    </span>
                                </div>
                            {/if}
                            <div class="mt-2 text-sm space-y-1">
                                {#if place.street || place.housenumber}
                                    <p>{place.street || ''} {place.housenumber || ''}</p>
                                {/if}
                                {#if place.city}
                                    <p>{place.postcode || ''} {place.city}</p>
                                {/if}
                                {#if place.website}
                                    <a href={place.website} target="_blank" rel="noopener noreferrer"
                                       class="text-blue-600 hover:underline truncate block">
                                        Website
                                    </a>
                                {/if}
                            </div>
                        </div>
                    {/each}
                </div>
            {/if}
        </div>

        <div class="grow relative h-full">
            <MapComponent bind:visibleFeatures={visibleFeatures} />
        </div>
    </div>
</MapLayout>
