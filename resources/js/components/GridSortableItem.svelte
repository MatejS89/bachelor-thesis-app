<script lang="ts">
    import { createSortable } from '@dnd-kit/svelte/sortable';
    import { X } from 'lucide-svelte';
    import { Button } from '@/components/ui/button';

    let { id, index, url, onRemove, isOverlay = false }: {
        id: string;
        index: number,
        url: string,
        onRemove: () => void
        isOverlay?: boolean,
    } = $props();

    const sortable = createSortable({
        get id() {
            return id;
        },
        get index() {
            return index;
        }
    });
</script>

<div
    {@attach sortable.attach}
    class="relative aspect-square w-full h-full cursor-grab active:cursor-grabbing rounded-md
           {isOverlay ? 'scale-105 shadow-2xl z-50 opacity-95' : ''}"
>
    <img
        src={url}
        alt="Uploaded preview"
        class="h-full w-full object-cover rounded-md pointer-events-none {!isOverlay && sortable.isDragging ? 'invisible' : ''}"
    />

    {#if !isOverlay && sortable.isDragging}
        <div
            class="absolute inset-0 flex items-center justify-center rounded-md border-2 border-dashed border-accent bg-card">
        </div>
    {/if}

    {#if !sortable.isDragging && !isOverlay}
        <div role="button"
             tabindex="0"
             onpointerdown={(e) => e.stopPropagation()}>
            <Button
                variant="default"
                type="button"
                class="absolute -right-2 -top-2 h-6 w-6 rounded-full shadow-md z-10 bg-red-500"
                onclick={onRemove}
                aria-label="Remove photo"
            >
                <X class="h-3 w-3" />
            </Button>
        </div>
    {/if}
</div>
