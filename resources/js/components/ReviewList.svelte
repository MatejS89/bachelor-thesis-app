<script lang="ts">
    import { Star } from 'lucide-svelte';
    import * as Card from '@/components/ui/card/index';
    import * as Carousel from '@/components/ui/carousel/index';
    import formatLocal from '@/utils/format-date';

    let { reviews }: {
        reviews: App.Data.ReviewData[]
    } = $props();
</script>
<Card.Root>
    <Card.Header>
        <Card.Title>Community Reviews</Card.Title>
    </Card.Header>

    <Card.Content>
        <div class="space-y-6">
            {#each reviews as review (review.id)}
                <div class="border-b border-border/50 pb-6 last:border-0 last:pb-0">
                    <div class="flex items-center justify-between mb-1">
                        <span class="font-medium text-foreground">{review.user.name}</span>
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


                    {#if review.photo_urls && review.photo_urls.length > 0}
                        <div class="mt-4 px-8 sm:px-10 w-full">
                            <Carousel.Root class="w-full">
                                <Carousel.Content class="-ml-2 md:-ml-4">
                                    {#each review.photo_urls as photo, j (photo)}
                                        <Carousel.Item class="pl-2 md:pl-4 basis-[85%] sm:basis-1/2 md:basis-1/3">
                                            <div class="overflow-hidden rounded-md border bg-muted">
                                                <img
                                                    src={photo}
                                                    alt="Review photo {j + 1}"
                                                    loading="lazy"
                                                    class="h-32 w-full object-cover transition-transform hover:scale-105"
                                                />
                                            </div>
                                        </Carousel.Item>
                                    {/each}
                                </Carousel.Content>

                                {#if review.photo_urls.length > 1}
                                    <Carousel.Previous class="h-7 w-7 -left-7" />
                                    <Carousel.Next class="h-7 w-7 -right-7" />
                                {/if}
                            </Carousel.Root>
                        </div>
                    {/if}
                </div>
            {/each}

            {#if reviews.length === 0}
                <p class="text-sm text-muted-foreground italic">No reviews yet.</p>
            {/if}

        </div>
    </Card.Content>

</Card.Root>
