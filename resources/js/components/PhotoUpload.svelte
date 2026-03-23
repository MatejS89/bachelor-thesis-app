<script lang="ts">
    import { useForm } from '@inertiajs/svelte';
    import { Images, Loader2, X } from 'lucide-svelte';
    import { Button } from '@/components/ui/button';
    import * as Card from '@/components/ui/card';
    import { Input } from '@/components/ui/input';
    import { Label } from '@/components/ui/label';

    let { selectedFeature } = $props();

    let previewUrls = $state<string[]>([]);

    const form = useForm({
        images: [] as File[]
    });

    function handleFileChange(event: Event) {
        const input = event.target as HTMLInputElement;

        if (input.files) {
            const newFiles = Array.from(input.files);
            $form.images = newFiles;
            previewUrls.forEach(url => URL.revokeObjectURL(url));

            previewUrls = newFiles.map(file => URL.createObjectURL(file));
        }
    }

    function removeFile(indexToRemove: number) {
        $form.images = $form.images.filter((_, i) => i !== indexToRemove);

        URL.revokeObjectURL(previewUrls[indexToRemove]);
        previewUrls = previewUrls.filter((_, i) => i !== indexToRemove);
    }

    function submit() {
        if ($form.images.length === 0) {
            return;
        }

        $form.post(`/map/${selectedFeature.id}`, {
            preserveScroll: true,
            onSuccess: () => {
                $form.reset('images');
                previewUrls.forEach(url => URL.revokeObjectURL(url));
                previewUrls = [];

                const fileInput = document.getElementById('gallery-upload') as HTMLInputElement;

                if (fileInput) {
                    fileInput.value = '';
                }
            }
        });
    }
</script>

<Card.Root class="w-full max-w-2xl">
    <Card.Header>
        <Card.Title>Restaurant Gallery</Card.Title>
        <Card.Description>Upload multiple photos of the interior, exterior, or food.</Card.Description>
    </Card.Header>

    <Card.Content class="space-y-6">
        {#if previewUrls.length > 0}
            <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {#each previewUrls as url, i (url)}
                    <div class="relative group aspect-square rounded-md overflow-hidden border">
                        <img src={url} alt="Preview {i}" class="w-full h-full object-cover" />

                        <button
                            type="button"
                            class="absolute top-1 right-1 bg-black/50 hover:bg-red-600 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                            onclick={() => removeFile(i)}
                            aria-label="Remove image"
                        >
                            <X class="w-4 h-4" />
                        </button>
                    </div>
                {/each}
            </div>
        {:else}
            <div
                class="flex flex-col items-center justify-center py-8 text-muted-foreground border-2 border-dashed rounded-lg bg-muted/30">
                <Images class="mb-3 h-10 w-10 opacity-50" />
                <p>No new images selected</p>
            </div>
        {/if}

        <div class="space-y-2">
            <Label for="gallery-upload">Select Multiple Images</Label>
            <Input
                id="gallery-upload"
                type="file"
                multiple
                accept="image/png, image/jpeg, image/webp"
                onchange={handleFileChange}
                disabled={$form.processing}
            />

            {#if Object.keys($form.errors).length > 0}
                <div class="text-sm font-medium text-destructive mt-2">
                    {#each Object.entries($form.errors) as [key, error] (key)}
                        <p>{error}</p>
                    {/each}
                </div>
            {/if}
        </div>
    </Card.Content>

    <Card.Footer>
        <Button
            onclick={submit}
            disabled={$form.images.length === 0 || $form.processing}
            class="w-full"
        >
            {#if $form.processing}
                <Loader2 class="mr-2 h-4 w-4 animate-spin" />
                Uploading {$form.images.length} files... {$form.progress ? `${$form.progress.percentage}%` : ''}
            {:else}
                Upload {$form.images.length > 0 ? $form.images.length : ''} Images
            {/if}
        </Button>
    </Card.Footer>
</Card.Root>
