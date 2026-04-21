<script lang="ts">
    import { Link, useForm } from '@inertiajs/svelte';
    import { Star, Loader2, ArrowLeft } from 'lucide-svelte';
    import DragAndDropPhotoContainer from '@/components/DragAndDropPhotoContainer.svelte';
    import { Button, buttonVariants } from '@/components/ui/button';
    import * as Card from '@/components/ui/card';
    import { Label } from '@/components/ui/label';
    import { Textarea } from '@/components/ui/textarea';
    import { show } from '@/routes/map';
    import { store } from '@/routes/map/review';

    type ImageItem = { id: string; file: File; url: string };

    const form = useForm({
        rating: 0,
        description: '',
        photos: [] as ImageItem[]
    });

    let { osmData }: {
        osmData: App.Data.OsmFeatureData
    } = $props();

    let hoverRating = $state(0);

    function submitReview(e: Event) {
        e.preventDefault();

        form.transform((data) => ({
            ...data,
            photos: data.photos.map(item => item.file)
        })).submit(store(osmData.id));
    }
</script>


<div class="p-3 h-full w-full overflow-y-auto lg:p-4 flex flex-col gap-2 md:gap-4">
    <header>
        <div class="flex items-center gap-4">
            <Link
                class={buttonVariants({ variant: "ghost", size: 'lg'})}
                href={show(osmData.id)}
            >
                <ArrowLeft />
            </Link>
            <div>
                <h1 class="text-3xl font-bold tracking-tight">Add review for {osmData.name}</h1>
            </div>
        </div>
    </header>
    <Card.Root>
        <Card.Content>
            <form onsubmit={submitReview} class="flex gap-4 flex-col">
                <fieldset class="border-0 p-0 m-0" onmouseleave={() => (hoverRating = 0)}>
                    <legend
                        class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 mb-2">
                        Rating
                    </legend>

                    <div class="flex items-center gap-1">
                        {#each [1, 2, 3, 4, 5] as star (star)}
                            <label
                                class="cursor-pointer p-1 transition-transform hover:scale-110 rounded-md focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2"
                                onmouseenter={() => (hoverRating = star)}
                            >
                                <input
                                    type="radio"
                                    name="rating"
                                    value={star}
                                    class="sr-only"
                                    bind:group={form.rating}
                                />
                                <Star
                                    class="h-8 w-8 transition-colors {star <= (hoverRating || form.rating)
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'text-muted-foreground'}"
                                />
                            </label>
                        {/each}
                    </div>
                </fieldset>

                <div>
                    <Label for="description" class="pb-3">Review Description</Label>
                    <Textarea
                        id="description"
                        placeholder="What did you like or dislike?"
                        bind:value={form.description}
                        rows={4}
                        class="resize-none"
                    />
                    {#if form.errors.description}
                        <p class="text-sm text-destructive">{form.errors.description}</p>
                    {/if}
                </div>

                <DragAndDropPhotoContainer bind:items={form.photos} />

                <div class="pt-2">
                    <Button type="submit" variant="default" class="w-full"
                            disabled={form.processing || form.rating === 0}>
                        {#if form.processing}
                            <Loader2 class="mr-2 h-4 w-4 animate-spin" />
                            Submitting...
                        {:else}
                            Submit
                        {/if}
                    </Button>
                </div>
            </form>
        </Card.Content>
    </Card.Root>
</div>
