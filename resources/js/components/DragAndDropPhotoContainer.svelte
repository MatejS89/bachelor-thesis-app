<script lang="ts">
    import { move } from '@dnd-kit/helpers';
    import { DragDropProvider, DragOverlay } from '@dnd-kit/svelte';
    import { ImagePlus } from 'lucide-svelte';
    import GridSortableItem from '@/components/GridSortableItem.svelte';
    import { Button } from '@/components/ui/button';
    import * as Card from '@/components/ui/card';

    type ImageItem = { id: string; file: File; url: string };

    let { items = $bindable() }: { items: ImageItem[] } = $props();
    let fileInput = $state<HTMLInputElement | null>(null);
    let snapshot: ImageItem[] = [];

    function onDragStart() {
        snapshot = items.slice();
    }

    function onDragOver(event: any) {
        items = move(items, event);
    }

    function onDragEnd(event: any) {
        if (event.canceled) {
            items = snapshot;
        }
    }

    function handleFileSelect(e: Event) {
        const target = e.target as HTMLInputElement;

        if (target.files) {
            const validFiles = Array.from(target.files).filter(file => file.type.startsWith('image/'));
            const newItems = validFiles.map(file => ({
                id: crypto.randomUUID(),
                file: file,
                url: URL.createObjectURL(file)
            }));
            items = [...items, ...newItems];
        }

        target.value = '';
    }

    function removePhoto(id: string) {
        const itemToRemove = items.find(i => i.id === id);

        if (itemToRemove) {
            URL.revokeObjectURL(itemToRemove.url);
        }

        items = items.filter(i => i.id !== id);
    }
</script>

<div class="max-w-225 mx-auto w-full">
    <Card.Root>
        <Card.Header class="flex flex-row items-center justify-between space-y-0 pb-7">
            <div>
                <Card.Title class="text-lg font-semibold">Photos</Card.Title>
                <Card.Description>Drag to reorder</Card.Description>
            </div>

            <Button variant="outline" size="sm" onclick={() => fileInput?.click()}>
                <ImagePlus class="mr-2 h-4 w-4" />
                Add Photos
            </Button>

            <input
                type="file"
                multiple
                accept="image/*"
                class="hidden"
                bind:this={fileInput}
                onchange={handleFileSelect}
            />
        </Card.Header>

        <Card.Content>
            <DragDropProvider {onDragStart} {onDragOver} {onDragEnd}>
                <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                    {#each items as item, index (item.id)}
                        <GridSortableItem
                            id={item.id}
                            {index}
                            url={item.url}
                            onRemove={() => removePhoto(item.id)}
                        />
                    {/each}
                </div>

                <DragOverlay>
                    {#snippet children(source)}
                        {#if source}
                            {@const draggedItem = items.find((item) => item.id === source.id)}
                            {#if draggedItem}
                                <GridSortableItem
                                    id={draggedItem.id}
                                    index={0}
                                    url={draggedItem.url}
                                    isOverlay={true}
                                    onRemove={() => {}}
                                />
                            {/if}
                        {/if}
                    {/snippet}
                </DragOverlay>
            </DragDropProvider>

            {#if items.length === 0}
                <div
                    onclick={handleFileSelect}
                    class="flex flex-col items-center justify-center py-12 border-2 border-dashed rounded-lg bg-muted/10 text-muted-foreground">
                    <ImagePlus class="h-10 w-10 mb-4 opacity-20" />
                    <p class="text-sm">No photos added yet.</p>

                </div>
            {/if}
        </Card.Content>

        {#if items.length > 0}
            <Card.Footer class="border-t bg-muted/5 py-3 px-6">
                <p class="text-xs text-muted-foreground">
                    {items.length} {items.length === 1 ? 'photo' : 'photos'} ready for upload.
                </p>
            </Card.Footer>
        {/if}
    </Card.Root>
</div>
