<script lang="ts">
    import { Link, useForm } from '@inertiajs/svelte';
    import { ArrowLeft } from 'lucide-svelte';
    import DragAndDropPhotoContainer from '@/components/DragAndDropPhotoContainer.svelte';
    import { Button, buttonVariants } from '@/components/ui/button';
    import * as Field from '@/components/ui/field/index';
    import { Input } from '@/components/ui/input';
    import { Textarea } from '@/components/ui/textarea';
    import { show, update } from '@/routes/map';
    import type { ImageItem } from '@/types/imageitem';

    let { osmData }: { osmData: App.Data.OsmFeatureData } = $props();


    const initialPhotos: ImageItem[] = (osmData.photos || []).map((photo) => ({
        id: photo.id.toString(),
        url: photo.url,
        isExisting: true
    }));

    let form = useForm({
        name: osmData.name,
        description: osmData.tags?.description ?? '',
        opening_hours: osmData.tags?.opening_hours ?? '',
        photos: initialPhotos
    });

    function onSubmit(e: Event) {
        e.preventDefault();

        form.submit(update(osmData));
    }
</script>

<div class="p-3 h-full w-full flex flex-col gap-x-4 gap-y-2">
    <header class="grid grid-cols-[auto_1fr] gap-x-4 gap-y-2">
        <Link
            class={buttonVariants({ variant: "ghost", size: "icon", class: "self-center" })}
            href={show(osmData)}
        >
            <ArrowLeft class="w-6 h-6" />
        </Link>
        <h1 class="text-3xl font-bold tracking-tight self-center">
            Edit {osmData.name}
        </h1>
    </header>

    <form onsubmit={onSubmit}>
        <Field.Group class="gap-4">
            <Field.Set>
                <Field.Field>
                    <Field.Label for="name">Name</Field.Label>
                    <Input id="name" type="text" bind:value={form.name} />
                </Field.Field>

                <Field.Field data-invalid={form.errors.description ? true : undefined}>
                    <Field.Label for="description">Description</Field.Label>

                    <Textarea bind:value={form.description} class="resize-none" id="description" rows={3}
                              aria-invalid={form.errors.description ? true : undefined} />

                    {#if form.errors.description}
                        <Field.Error>{form.errors.description}</Field.Error>
                    {/if}
                </Field.Field>

                <Field.Field>
                    <Field.Label for="opening_hours">Opening hours</Field.Label>
                    <Input id="opening_hours" type="text" bind:value={form.opening_hours} />
                </Field.Field>

                <Field.Field>
                    <DragAndDropPhotoContainer bind:items={form.photos} />
                </Field.Field>

            </Field.Set>

            <Field.Field orientation="horizontal">
                <Button type="submit" class="w-full">
                    Save
                </Button>
            </Field.Field>

        </Field.Group>
    </form>
</div>
