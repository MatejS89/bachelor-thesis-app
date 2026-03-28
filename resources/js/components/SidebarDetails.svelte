<script lang="ts">
    import { ArrowLeft, ImagePlus } from 'lucide-svelte';
    import PhotoUpload from '@/components/PhotoUpload.svelte';
    import { Button } from '@/components/ui/button';
    import * as Carousel from '@/components/ui/carousel';
    import * as Dialog from '@/components/ui/dialog';

    let { selectedFeature, selectPlace } = $props();
    let isUploadModalOpen = $state(false);
</script>

<div class="sticky top-0 bg-white z-20 border-b p-4">
    <button
        class="flex items-center text-sm text-gray-500 hover:text-gray-900 transition-colors mb-4"
        onclick={() => selectPlace(null)}
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
    {#if selectedFeature.gallery_images && selectedFeature.gallery_images.length > 0}
        <div class="w-full">
            <Carousel.Root class="w-full relative rounded-md overflow-hidden">
                <Carousel.Content>
                    {#each selectedFeature.gallery_images as image, index (image.id)}
                        <Carousel.Item>
                            <div class="w-full aspect-video bg-muted relative">
                                <img
                                    src={image.url}
                                    alt="Gallery"
                                    loading={index === 0 ? "eager" : "lazy"}
                                    decoding="async"
                                    class="absolute inset-0 w-full h-full object-cover"
                                />
                            </div>
                        </Carousel.Item>
                    {/each}
                </Carousel.Content>

                {#if selectedFeature.gallery_images.length > 1}
                    <Carousel.Previous
                        class="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/75 text-white border-none opacity-0 group-hover:opacity-100 transition-opacity" />
                    <Carousel.Next
                        class="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/75 text-white border-none opacity-0 group-hover:opacity-100 transition-opacity" />
                {/if}
            </Carousel.Root>
        </div>
    {/if}

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
            <a href={selectedFeature.website} target="_blank" rel="noopener noreferrer"
               class="text-blue-600 hover:underline break-all block">
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

    <Dialog.Root bind:open={isUploadModalOpen}>
        <Dialog.Trigger>
            {#snippet child({ props })}
                <Button {...props} variant="outline" class="w-full mt-2">
                    <ImagePlus class="w-4 h-4 mr-2" />
                    Add Photos
                </Button>
            {/snippet}
        </Dialog.Trigger>
        <Dialog.Content class="sm:max-w-2xl border-none shadow-none bg-transparent p-0">
            <PhotoUpload {selectedFeature} />
        </Dialog.Content>
    </Dialog.Root>

    <div class="pt-4 border-t text-xs text-gray-400">
        OSM ID: {selectedFeature.osm_id || selectedFeature.id}
    </div>
</div>
