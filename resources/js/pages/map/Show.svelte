<script lang="ts">
    import { router, Link } from '@inertiajs/svelte';
    import {
        MapPin,
        Phone,
        Globe,
        Clock,
        Utensils,
        Accessibility,
        ArrowLeft
    } from 'lucide-svelte';
    import opening_hours from 'opening_hours';
    import ActionNav from '@/components/ActionNav.svelte';
    import MenuItemList from '@/components/MenuItemList.svelte';
    import ReviewList from '@/components/ReviewList.svelte';
    import { Badge } from '@/components/ui/badge/index.js';
    import { buttonVariants } from '@/components/ui/button';
    import * as Card from '@/components/ui/card/index';
    import * as Carousel from '@/components/ui/carousel/index';
    import * as Tabs from '@/components/ui/tabs/index';
    import { index } from '@/routes/map';

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

    <ActionNav {restaurantData} />

    <div class="w-full">
        <Tabs.Root value="menu" class="w-full">
            <Tabs.List class="w-full">
                <Tabs.Trigger value="menu">
                    Menu
                </Tabs.Trigger>

                <Tabs.Trigger value="reviews">
                    Reviews
                </Tabs.Trigger>
            </Tabs.List>

            <Tabs.Content value="menu">
                <MenuItemList {menuItems} />
            </Tabs.Content>

            <Tabs.Content value="reviews">
                <ReviewList {reviews} />
            </Tabs.Content>
        </Tabs.Root>
    </div>
</div>
