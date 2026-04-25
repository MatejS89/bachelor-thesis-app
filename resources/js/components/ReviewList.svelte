<script lang="ts">
    import { Link } from '@inertiajs/svelte';
    import { CirclePlus, Star } from 'lucide-svelte';
    import { buttonVariants } from '@/components/ui/button';
    import * as Card from '@/components/ui/card/index';
    import * as Carousel from '@/components/ui/carousel/index';
    import * as Empty from '@/components/ui/empty/index';
    import { create as createReview } from '@/routes/map/review';
    import formatLocal from '@/utils/format-date';

    let { restaurantData, reviews }: {
        restaurantData: App.Data.OsmFeatureData,
        reviews: App.Data.ReviewData[]
    } = $props();
</script>

<Card.Root>
    <Card.Header>
        <Card.Title>Reviews</Card.Title>
    </Card.Header>

    <Card.Content>
        {#if reviews.length > 0}
            {#each reviews as review (review.id)}
                <div class="border-b border-border/50 pb-6 last:border-0 last:pb-0">
                    <div class="flex items-center justify-between mb-1">
                        <span class="font-medium text-foreground">{review?.user?.name}</span>
                        <span
                            class="text-sm text-muted-foreground">{formatLocal(review.created_at)}</span>
                    </div>
                    <div class="flex items-center gap-0.5 text-yellow-500 mb-2">
                        {#each Array(5) as _, i(i)}
                            <Star
                                class="h-4 w-4 {i < review.rating ? 'fill-yellow-500' : 'text-muted/50 fill-muted/50'}"
                            />
                        {/each}
                    </div>
                    <p class="text-sm text-foreground/90">{review.description}</p>

                    {#if review.photos && review.photos.length > 0}
                        <div class="mt-4 px-8 sm:px-10 w-full">
                            <Carousel.Root class="w-full">
                                <Carousel.Content class="-ml-2 md:-ml-4">
                                    {#each review.photos as photo, j (photo.id)}
                                        <Carousel.Item class="pl-2 md:pl-4 basis-[85%] sm:basis-1/2 md:basis-1/3">
                                            <div class="overflow-hidden rounded-md border bg-muted">
                                                <img
                                                    src={photo.url}
                                                    alt="Review photo {j + 1}"
                                                    loading="lazy"
                                                    decoding="async"
                                                    class="h-32 w-full object-cover"
                                                />
                                            </div>
                                        </Carousel.Item>
                                    {/each}
                                </Carousel.Content>

                                <Carousel.Previous />
                                <Carousel.Next />
                            </Carousel.Root>
                        </div>
                    {/if}
                </div>
            {/each}

        {:else}
            <Empty.Root>
                <Empty.Header>
                    <Empty.Media variant="icon">
                        <CirclePlus />
                    </Empty.Media>

                    <Empty.Title>No reviews yet</Empty.Title>
                </Empty.Header>

                <Empty.Content>
                    <Link
                        href={createReview(restaurantData)}
                        class={buttonVariants({ variant: 'outline' })}
                    >
                        Add a review
                    </Link>
                </Empty.Content>
            </Empty.Root>
        {/if}
    </Card.Content>
</Card.Root>
