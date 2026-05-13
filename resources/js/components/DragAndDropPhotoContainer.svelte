<script lang="ts">
    import { move } from '@dnd-kit/helpers';
    import { DragDropProvider, DragOverlay } from '@dnd-kit/svelte';
    import { ImagePlus } from 'lucide-svelte';
    import GridSortableItem from '@/components/GridSortableItem.svelte';
    import { Button } from '@/components/ui/button';
    import * as Empty from '@/components/ui/empty/index';
    import * as Field from '@/components/ui/field/index';
    import type { ImageItem } from '@/types/imageitem';

    let {
        items = $bindable(),
        invalid = false,
        disabled = false,
        maxFiles = Infinity,
        maxFileSizeKb = Infinity
    }: {
        items: ImageItem[];
        invalid?: boolean;
        disabled?: boolean;
        maxFiles?: number;
        maxFileSizeKb?: number;
    } = $props();

    let fileInput = $state<HTMLInputElement | null>(null);
    let snapshot: ImageItem[] = [];
    let errors = $state<string[]>([]);

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
        errors = [];

        if (target.files) {
            const imageFiles = Array.from(target.files).filter((file) =>
                file.type.startsWith('image/')
            );

            const oversized = imageFiles.filter((f) => f.size / 1024 > maxFileSizeKb);

            if (oversized.length > 0) {
                const limitMb = maxFileSizeKb >= 1024
                    ? `${(maxFileSizeKb / 1024).toFixed(0)} MB`
                    : `${maxFileSizeKb} KB`;
                errors = [...errors, `${oversized.length} file(s) exceed the ${limitMb} size limit and were not added.`];
            }

            const validFiles = imageFiles.filter((f) => f.size / 1024 <= maxFileSizeKb);

            const remainingSlots = maxFiles - items.length;

            if (validFiles.length > remainingSlots) {
                errors = [...errors, `Only ${remainingSlots} more photo(s) can be added (maximum ${maxFiles}).`];
            }

            const allowedFiles = validFiles.slice(0, remainingSlots);

            const newItems = allowedFiles.map((file) => ({
                id: crypto.randomUUID(),
                file: file,
                url: URL.createObjectURL(file),
                isExisting: false
            }));

            items = [...items, ...newItems];
        }

        target.value = '';
    }

    function removePhoto(id: string) {
        const itemToRemove = items.find((i) => i.id === id);

        if (itemToRemove) {
            URL.revokeObjectURL(itemToRemove.url);
        }

        items = items.filter((i) => i.id !== id);
    }
</script>

<Field.Field>
    <div class="flex items-center justify-between">
        <div>
            <Field.Label for="photo-input">Photos</Field.Label>
            <Field.Description>Drag photos to reorder</Field.Description>
        </div>

        <Button
            variant="outline"
            size="sm"
            type="button"
            onclick={() => fileInput?.click()}
            {disabled}
        >
            <ImagePlus class="mr-2 h-4 w-4" />
            Add Photos
        </Button>
    </div>

    <input
        id="photo-input"
        type="file"
        multiple
        accept="image/*"
        class="hidden"
        bind:this={fileInput}
        onchange={handleFileSelect}
        {disabled}
    />

    <div
        class={'relative rounded-md border p-4 transition-colors ' +
            (invalid
                ? 'border-destructive/50 bg-destructive/5 '
                : 'border-input bg-transparent ') +
            (items.length === 0 ? 'border-dashed' : '')}
    >
        <DragDropProvider {onDragStart} {onDragOver} {onDragEnd}>
            {#if items.length > 0}
                <div
                    class="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5"
                >
                    {#each items as item, index (item.id)}
                        <GridSortableItem
                            id={item.id}
                            {index}
                            url={item.url}
                            onRemove={() => removePhoto(item.id)}
                        />
                    {/each}
                </div>
            {:else}
                <Empty.Root>
                    <Empty.Media>
                        <ImagePlus />
                    </Empty.Media>

                    <Empty.Title>No photos added</Empty.Title>
                </Empty.Root>
            {/if}

            <DragOverlay>
                {#snippet children(source)}
                    {#if source}
                        {@const draggedItem = items.find(
                            (item) => item.id === source.id,
                        )}
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
    </div>

    <div class="flex flex-col">
        {#if errors.length > 0}
            {#each errors as error (error)}
                <Field.Error>{error}</Field.Error>
            {/each}
        {/if}

        {#if items.length > 0}
            <p class="text-xs text-muted-foreground text-right">
                {items.length}{maxFiles !== Infinity ? `/${maxFiles}` : ''}
                {items.length === 1 ? 'photo' : 'photos'} attached
            </p>
        {/if}
    </div>
</Field.Field>
