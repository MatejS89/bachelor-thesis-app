<script lang="ts">
    let { visibleFeatures, selectPlace } = $props();
</script>

<div class="p-4 border-b bg-gray-50">
    <h2 class="text-xl font-bold text-gray-800">Restaurants</h2>
    <p class="text-sm text-gray-500 mt-1">Found {visibleFeatures.length} places in view</p>
</div>
<div class="divide-y">
    {#each visibleFeatures as place (place.id)}
        <div
            class="p-4 hover:bg-gray-50 transition-colors text-gray-600 cursor-pointer"
            onclick={() => selectPlace(place.id || place.osm_id)}
            role="button"
            tabindex="0"
        >
            <h3 class="font-semibold text-lg text-gray-800">{place.name || 'Unnamed Place'}</h3>
            {#if place.cuisine}
                <div class="flex items-center mt-1">
                    <span class="inline-block px-2 py-0.5 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
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
