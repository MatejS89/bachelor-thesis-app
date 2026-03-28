<script lang="ts">
    import { Link, page } from '@inertiajs/svelte';
    import { show } from '@/actions/App/Http/Controllers/OsmDataController';

    type OsmGeoJSONCollectionData = App.Data.OsmGeoJSONCollectionData;

    let { visibleFeatures }: {
        visibleFeatures: OsmGeoJSONCollectionData
    } = $props();
</script>

<div class="p-4 border-b bg-gray-50">
    <h2 class="text-xl font-bold text-gray-800">Restaurants</h2>
    <p class="text-sm text-gray-500 mt-1">Found {visibleFeatures.features.length} places in view</p>
</div>

<ol class="divide-y">
    {#each visibleFeatures.features as place (place.id)}
        {@const info = place.properties}
        <li
            class="p-4 hover:bg-gray-50 transition-colors text-gray-600 cursor-pointer"
        >
            <Link
                href={show(info.id)}
                data={page.props.queryParams}
                preserveState
                preserveScroll
                only={['selectedFeature']}
                class="block p-4 hover:bg-gray-50 transition-colors text-gray-600 no-underline"
            >
                <h3 class="font-semibold text-lg text-gray-800">{info.name || 'Unnamed Place'}</h3>
                {#if info.cuisine}
                    <div class="flex items-center mt-1">
                    <span class="inline-block px-2 py-0.5 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                        {info.cuisine}
                    </span>
                    </div>
                {/if}
                <div class="mt-2 text-sm space-y-1">
                    {#if info.street || info.housenumber}
                        <p>{info.street || ''} {info.housenumber || ''}</p>
                    {/if}
                    {#if info.city}
                        <p>{info.postcode || ''} {info.city}</p>
                    {/if}
                </div>
            </Link>
        </li>
    {/each}
</ol>
