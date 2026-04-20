<script lang="ts">
    import { router, Link } from '@inertiajs/svelte';
    import {
        MapPin,
        Phone,
        Globe,
        Clock,
        Utensils,
        Accessibility,
        ArrowLeft,
        Star,
        UtensilsCrossed, SquarePen
    } from 'lucide-svelte';
    import opening_hours from 'opening_hours';
    import { Badge } from '@/components/ui/badge/index.js';
    import { buttonVariants } from '@/components/ui/button';
    import { Button } from '@/components/ui/button';
    import * as Card from '@/components/ui/card/index';
    import * as Carousel from '@/components/ui/carousel/index';
    import * as Tabs from '@/components/ui/tabs/index';
    import { index } from '@/routes/map';
    import { create as createMenuItem } from '@/routes/map/menu-item';
    import { create as createReview } from '@/routes/map/review';
    import formatLocal from '@/utils/format-date';

    let { selectedFeature: restaurantData, reviews }: {
        selectedFeature: App.Data.OsmFeatureData,
        reviews: App.Data.ReviewData[]
    } = $props();

    let images = $state([
        'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1200&q=80',
        'https://images.unsplash.com/photo-1552566626-52f8b828add9?w=1200&q=80',
        'https://images.unsplash.com/photo-1544148103-0773bf10d330?w=1200&q=80'
    ]);


    let menuItems = $state([
        {
            id: 1,
            name: 'House Signature Burger',
            description: 'Double beef patty, aged cheddar, caramelized onions, house sauce.',
            price: '$16.50',
            category: 'Mains'
        },
        {
            id: 2,
            name: 'Truffle Parmesan Fries',
            description: 'Crispy cut fries tossed in white truffle oil and fresh parmesan.',
            price: '$8.00',
            category: 'Sides'
        },
        {
            id: 3,
            name: 'Heirloom Tomato Salad',
            description: 'Fresh heirloom tomatoes, burrata, basil, balsamic glaze.',
            price: '$12.00',
            category: 'Starters'
        },
        {
            id: 4,
            name: 'Artisan Lemonade',
            description: 'Freshly squeezed lemons with a hint of mint and agave.',
            price: '$4.50',
            category: 'Drinks'
        }
    ]);

    let isOpenNow = $derived.by(() => {
        const rawHours = restaurantData?.tags?.opening_hours;

        if (!rawHours) {
            return null;
        }

        try {
            const oh = new opening_hours(rawHours);

            return oh.getState();
        } catch (e) {
            console.warn('Invalid opening hours format:', e);

            return null;
        }
    });

    let formattedHours = $derived.by(() => {
        const rawHours = restaurantData?.tags?.opening_hours;

        if (!rawHours) {
            return [];
        }

        const rules = rawHours.split(';').map(r => r.trim()).filter(Boolean);
        const dayMap: Record<string, string> = {
            'Mo': 'Mon', 'Tu': 'Tue', 'We': 'Wed',
            'Th': 'Thu', 'Fr': 'Fri', 'Sa': 'Sat',
            'Su': 'Sun', 'PH': 'Holidays'
        };

        return rules.map(rule => {
            let formattedRule = rule;
            Object.entries(dayMap).forEach(([abbr, full]) => {
                const regex = new RegExp(`\\b${abbr}\\b`, 'g');
                formattedRule = formattedRule.replace(regex, full);
            });

            let days = formattedRule;
            let times = '';

            if (formattedRule.includes('off')) {
                days = formattedRule.replace(/\boff\b/g, '').trim();
                times = 'Closed';
            } else {
                const firstDigitIdx = formattedRule.search(/\d/);

                if (firstDigitIdx !== -1) {
                    days = formattedRule.substring(0, firstDigitIdx).trim();
                    times = formattedRule.substring(firstDigitIdx).trim();
                }
            }

            return {
                days: days.replace(/[:,\s]+$/, ''),
                times
            };
        });
    });

    function handleBack() {
        const params = new URLSearchParams(window.location.search);
        const queryData = Object.fromEntries(params);

        const cameFromApp = document.referrer.includes(window.location.host);

        if (cameFromApp && window.history.length > 1) {
            window.history.back();
        } else {
            router.get(index(), queryData);
        }
    }

    $inspect(reviews);
</script>

<div class="p-3 h-full w-full overflow-y-auto lg:p-4 flex flex-col gap-2 md:gap-4">
    <header>
        <div class="flex items-center gap-4">
            <Link
                class={buttonVariants({ variant: "ghost", size: 'lg'})}
                href={index()}
            >
                <ArrowLeft />
            </Link>
            <div>
                <h1 class="text-3xl font-bold tracking-tight">{restaurantData.name}</h1>
            </div>
        </div>

        <p class="text-muted-foreground flex items-center gap-2 mt-2 text-lg">
            <MapPin class="h-5 w-5" />
            {restaurantData.tags['addr:street']} {restaurantData.tags['addr:housenumber']}
            , {restaurantData.tags['addr:city']} {restaurantData.tags['addr:postcode']}
        </p>
    </header>

    <div class="w-full px-12">
        <Carousel.Root class="w-full">
            <Carousel.Content>
                {#each images as img, i(img)}
                    <Carousel.Item class="basis-[85%]">
                        <Card.Root class="overflow-hidden border-0 shadow-none p-0">
                            <Card.Content
                                class="p-0 aspect-auto items-center justify-center rounded-xl overflow-hidden bg-muted">
                                <img
                                    src={img}
                                    alt="Restaurant interior {i + 1}"
                                    loading="lazy"
                                    decoding="async"
                                    class="object-cover w-full h-full"
                                />
                            </Card.Content>
                        </Card.Root>
                    </Carousel.Item>
                {/each}
            </Carousel.Content>
            <Carousel.Previous />
            <Carousel.Next />
        </Carousel.Root>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
        <Card.Root>
            <Card.Header>
                <Card.Title>Restaurant Details</Card.Title>
                <Card.Description>OSM Node: {restaurantData.id}</Card.Description>
            </Card.Header>
            <Card.Content class="space-y-6">
                <div class="flex items-start gap-3">
                    <Utensils class="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
                    <div>
                        <p class="font-medium leading-none mb-2">Cuisine</p>
                        <div class="flex gap-2 flex-wrap">
                            {#each restaurantData.tags?.cuisine?.split(';') || [] as cuisine(cuisine)}
                                <Badge variant="secondary" class="capitalize">{cuisine}</Badge>
                            {/each}
                        </div>
                    </div>
                </div>

                <div class="flex items-start gap-3">
                    <Clock class="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
                    <div class="w-full">
                        <div class="flex items-center justify-between mb-3">
                            <p class="font-medium leading-none">Opening Hours</p>
                            {#if isOpenNow !== null}
                                <Badge
                                    variant={isOpenNow ? "default" : "secondary"}
                                    class={isOpenNow ? "bg-green-600 hover:bg-green-700 text-white" : ""}
                                >
                                    {isOpenNow ? "Open Now" : "Closed"}
                                </Badge>
                            {/if}
                        </div>

                        {#if formattedHours.length > 0}
                            <div class="space-y-2 bg-muted/30 p-3 rounded-md">
                                {#each formattedHours as { days, times }}
                                    <div
                                        class="flex items-start justify-between text-sm border-b border-border/40 pb-2 last:border-0 last:pb-0 gap-4">
                                        <span class="font-medium text-foreground">{days}</span>
                                        <span class="text-muted-foreground text-right">{times}</span>
                                    </div>
                                {/each}
                            </div>
                        {:else}
                            <p class="text-sm text-muted-foreground">Hours not available</p>
                        {/if}
                    </div>
                </div>
            </Card.Content>
        </Card.Root>

        <Card.Root>
            <Card.Header>
                <Card.Title>Features & Accessibility</Card.Title>
            </Card.Header>
            <Card.Content class="space-y-6">
                {#if restaurantData.tags.wheelchair}
                    <div class="flex items-center gap-3">
                        <Accessibility class="h-5 w-5 text-muted-foreground shrink-0" />
                        <div>
                            <p class="font-medium leading-none mb-1">Wheelchair Accessible</p>
                            <p class="text-sm text-muted-foreground capitalize">{restaurantData.tags.wheelchair}</p>
                        </div>
                    </div>
                {/if}

                <div class="pt-2">
                    <p class="font-medium mb-3">Dietary Options</p>
                    <div class="flex gap-2">
                        {#if restaurantData.tags['diet:vegetarian'] === 'yes'}
                            <Badge variant="outline"
                                   class="border-green-600/50 text-green-700 bg-green-50 dark:bg-green-950/50">
                                Vegetarian
                            </Badge>
                        {/if}

                        {#if restaurantData.tags['diet:vegan'] === 'yes'}
                            <Badge variant="outline"
                                   class="border-green-600/50 text-green-700 bg-green-50 dark:bg-green-950/50">Vegan
                            </Badge>
                        {/if}
                    </div>
                </div>
            </Card.Content>
        </Card.Root>
    </div>

    <nav class="w-full flex flex-row justify-between gap-1.5">
        <Link
            class={buttonVariants({ variant: "default", class: "flex-1 flex-col h-auto py-3 gap-1.5" })}
            as="button"
            href={createReview(restaurantData.id)}
        >
            <Star class="h-5 w-5" />
            <span class="text-xs">Add review</span>
        </Link>

        <Link
            href={createMenuItem(restaurantData.id)}
            class={buttonVariants({ variant: "default", class: "flex-1 flex-col h-auto py-3 gap-1.5" })}
            as="button"
        >
            <UtensilsCrossed class="h-5 w-5" />
            <span class="text-xs">Add menu item</span>
        </Link>

        <Button class="flex-1 flex-col h-auto py-3 gap-1.5">
            <SquarePen class="h-5 w-5" />
            <span class="text-xs">Edit details</span>
        </Button>
    </nav>

    <div class="w-full">
        <Tabs.Root value="menu" class="w-full">

            <Tabs.List class="w-full">
                <Tabs.Trigger
                    value="menu"
                >
                    Menu
                </Tabs.Trigger>

                <Tabs.Trigger
                    value="reviews"
                >
                    Reviews
                </Tabs.Trigger>
            </Tabs.List>

            <Tabs.Content value="menu">
                <Card.Root>
                    <Card.Header>
                        <Card.Title>Our Menu</Card.Title>
                        <Card.Description>Explore our delicious offerings</Card.Description>
                    </Card.Header>
                    <Card.Content>
                        <div class="space-y-6">
                            {#each menuItems as item (item.id)}
                                <div
                                    class="flex justify-between items-start border-b border-border/50 pb-4 last:border-0 last:pb-0">
                                    <div class="pr-4">
                                        <h4 class="font-medium text-foreground">{item.name}</h4>
                                        <p class="text-sm text-muted-foreground mt-1 leading-relaxed">{item.description}</p>
                                        <Badge variant="secondary"
                                               class="mt-2 text-xs font-normal">{item.category}</Badge>
                                    </div>
                                    <span class="font-semibold whitespace-nowrap">{item.price}</span>
                                </div>
                            {/each}
                            {#if menuItems.length === 0}
                                <p class="text-sm text-muted-foreground italic">Menu coming soon.</p>
                            {/if}
                        </div>
                    </Card.Content>
                </Card.Root>
            </Tabs.Content>

            <Tabs.Content value="reviews">
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
                                </div>
                            {/each}

                            {#if reviews.length === 0}
                                <p class="text-sm text-muted-foreground italic">No reviews yet. Be the first to leave
                                    one!</p>
                            {/if}
                        </div>
                    </Card.Content>
                </Card.Root>
            </Tabs.Content>
        </Tabs.Root>
    </div>
</div>
