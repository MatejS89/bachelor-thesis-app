<script lang="ts">
    import { ArrowLeft } from 'lucide-svelte';

    let { visibleFeatures, selectedFeature, selectPlace }: {
        visibleFeatures: any[];
        selectedFeature?: any;
        selectPlace: (id: number | null) => void;
    } = $props();
</script>

<div class="w-96 shrink-0 bg-white border-r shadow-lg overflow-y-auto z-10">
    {#if selectedFeature}
        <div class="sticky top-0 bg-white z-20 border-b p-4">
            <button
                class="flex items-center text-sm text-gray-500 hover:text-gray-900 transition-colors mb-4"
                onclick={() => (selectPlace(null))}
            >
                <ArrowLeft class="w-4 h-4 mr-1" />
                Back to list
            </button>
            <h2 class="text-2xl font-bold text-gray-900 leading-tight">{selectedFeature.name || 'Unnamed Place'}</h2>
            {#if selectedFeature.cuisine}
                <div class="mt-2">
                    <span class="inline-block px-2 py-0.5 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                        {selectedFeature.cuisine}
                    </span>
                </div>
            {/if}
        </div>

        <div class="p-4 space-y-6">
            {#if selectedFeature.street || selectedFeature.housenumber || selectedFeature.city || selectedFeature.postcode}
                <div>
                    <h3 class="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">Address</h3>
                    <p class="text-gray-700">
                        {#if selectedFeature.street || selectedFeature.housenumber}
                            {selectedFeature.street || ''} {selectedFeature.housenumber || ''}<br />
                        {/if}
                        {selectedFeature.postcode || ''} {selectedFeature.city || ''}
                    </p>
                </div>
            {/if}

            {#if selectedFeature.phone}
                <div>
                    <h3 class="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">Phone</h3>
                    <p class="text-gray-700"><a href="tel:{selectedFeature.phone}"
                                                class="hover:underline">{selectedFeature.phone}</a></p>
                </div>
            {/if}

            {#if selectedFeature.website}
                <div>
                    <h3 class="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">Website</h3>
                    <a
                        href={selectedFeature.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        class="text-blue-600 hover:underline break-all block"
                    >
                        {selectedFeature.website}
                    </a>
                </div>
            {/if}

            {#if selectedFeature.opening_hours}
                <div>
                    <h3 class="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">Opening Hours</h3>
                    <p class="text-gray-700 whitespace-pre-wrap text-sm">{selectedFeature.opening_hours.replace(/;/g, '\n')}</p>
                </div>
            {/if}

            <div class="pt-4 border-t text-xs text-gray-400">
                OSM ID: {selectedFeature.osm_id || selectedFeature.id}
            </div>
        </div>
    {:else if visibleFeatures.length === 0}
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
                <div class="p-4 hover:bg-gray-50 transition-colors text-gray-600"
                     onclick={() => selectPlace(place.id || place.osm_id)}>
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
                            <a
                                href={place.website}
                                target="_blank"
                                rel="noopener noreferrer"
                                class="text-blue-600 hover:underline truncate block"
                            >
                                Website
                            </a>
                        {/if}
                    </div>
                </div>
            {/each}
        </div>
    {/if}
</div>
