<script lang="ts">
    import { Link, useForm } from '@inertiajs/svelte';
    import { Star, ArrowLeft } from 'lucide-svelte';
    import DragAndDropPhotoContainer from '@/components/DragAndDropPhotoContainer.svelte';
    import { Button, buttonVariants } from '@/components/ui/button';
    import * as Card from '@/components/ui/card';
    import * as Field from '@/components/ui/field/index';
    import { Spinner } from '@/components/ui/spinner';
    import { Textarea } from '@/components/ui/textarea';
    import { show } from '@/routes/map';
    import { store } from '@/routes/map/review';
    import type { ImageItem } from '@/types/imageitem';

    const form = useForm<{
        rating: number;
        description: string;
        photos: ImageItem[];
    }>({
        rating: 0,
        description: '',
        photos: []
    });

    let {
        osmData,
        maxPhotos,
        maxPhotoSizeKb
    }: {
        osmData: App.Data.OsmData.OsmFeatureData;
        maxPhotos: number;
        maxPhotoSizeKb: number;
    } = $props();

    let hoverRating = $state(0);

    function submitReview(e: Event) {
        e.preventDefault();

        form.transform((data) => ({
            ...data,
            photos: data.photos.map((item) => item.file)
        })).submit(store(osmData));
    }
</script>

<div
    class="p-3 h-full w-full overflow-y-auto lg:p-4 flex flex-col gap-2 md:gap-4"
>
    <header>
        <div class="flex items-center gap-4">
            <Link
                class={buttonVariants({ variant: 'ghost', size: 'lg' })}
                href={show(osmData)}
            >
                <ArrowLeft />
            </Link>
            <div>
                <h1 class="text-3xl font-bold tracking-tight">
                    Add review for {osmData.name}
                </h1>
            </div>
        </div>
    </header>

    <form onsubmit={submitReview} class="flex flex-col gap-4">
        <Field.Set>
            <Card.Root>
                <Card.Content>
                    <Field.Group>
                        <Field.Field
                            data-invalid={form.errors.rating ? true : undefined}
                        >
                            <Field.Label>Rating</Field.Label>

                            <div class="flex items-center gap-1">
                                {#each [1, 2, 3, 4, 5] as star (star)}
                                    <label
                                        class="cursor-pointer p-1 transition-transform hover:scale-110 rounded-md focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2"
                                        onmouseenter={() =>
                                            (hoverRating = star)}
                                        onmouseleave={() =>
                                            (hoverRating = form.rating)}
                                    >
                                        <input
                                            aria-invalid={form.errors.rating
                                                ? true
                                                : undefined}
                                            type="radio"
                                            name="rating"
                                            value={star}
                                            class="sr-only"
                                            bind:group={form.rating}
                                        />
                                        <Star
                                            class="h-8 w-8 transition-colors {star <=
                                            (hoverRating || form.rating)
                                                ? 'fill-yellow-400 text-yellow-400'
                                                : 'text-muted-foreground'}"
                                        />
                                    </label>
                                {/each}
                            </div>

                            {#if form.errors.rating}
                                <Field.Error>
                                    {form.errors.rating}
                                </Field.Error>
                            {/if}
                        </Field.Field>

                        <Field.Field
                            data-invalid={form.errors.description
                                ? true
                                : undefined}
                        >
                            <Field.Label>Description</Field.Label>

                            <Textarea
                                id="description"
                                placeholder="What did you like or dislike?"
                                bind:value={form.description}
                                rows={4}
                                class="resize-none"
                                aria-invalid={form.errors.description
                                    ? true
                                    : undefined}
                            />

                            {#if form.errors.description}
                                <Field.Error>
                                    {form.errors.description}
                                </Field.Error>
                            {/if}
                        </Field.Field>
                    </Field.Group>
                </Card.Content>
            </Card.Root>

            <Card.Root>
                <Card.Content>
                    <Field.Group>
                        <DragAndDropPhotoContainer
                            bind:items={form.photos}
                            invalid={!!form.errors.photos}
                            disabled={form.processing}
                            maxFiles={maxPhotos}
                            maxFileSizeKb={maxPhotoSizeKb}
                        />
                    </Field.Group>
                </Card.Content>
            </Card.Root>
        </Field.Set>

        <Field.Field>
            <Button
                type="submit"
                disabled={form.processing || form.rating === 0
                    ? true
                    : undefined}
            >
                {#if form.processing}
                    <Spinner />
                {/if}

                Submit
            </Button>
        </Field.Field>
    </form>
</div>
