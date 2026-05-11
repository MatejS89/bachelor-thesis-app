<script lang="ts">
    import { Link, page } from '@inertiajs/svelte';
    import { MapPin, ArrowLeft, ImagePlus, Star } from 'lucide-svelte';
    import ActionNav from '@/components/ActionNav.svelte';
    import MenuItemList from '@/components/MenuItemList.svelte';
    import OsmDataDetailContainer from '@/components/OsmDataDetailContainer.svelte';
    import ReviewList from '@/components/ReviewList.svelte';
    import { buttonVariants } from '@/components/ui/button';
    import * as Card from '@/components/ui/card/index';
    import * as Carousel from '@/components/ui/carousel/index';
    import * as Empty from '@/components/ui/empty/index';
    import * as Tabs from '@/components/ui/tabs/index';
    import { index, edit } from '@/routes/map';
    import { getAppContext } from '@/state/appState.svelte';

    let { stateManager } = getAppContext();

    let {
        selectedFeature: restaurantData,
        reviews,
        menuItems,
        allergens
    }: {
        selectedFeature: App.Data.OsmData.OsmFeatureData;
        reviews: App.Data.Review.ReviewData[];
        menuItems: App.Data.MenuItem.MenuItemData[];
        allergens: App.Data.Allergen.AllergenData[];
    } = $props();

    $effect(() => {
        stateManager.mapShown = false;
    });
</script>

<div
    class="px-1.5 md:px-3 py-3 h-full w-full min-w-0 flex flex-col gap-3 overflow-y-auto overflow-x-hidden"
    scroll-region=""
>
    <header class="grid grid-cols-[auto_1fr] gap-x-4 gap-y-2">
        <Link
            class={buttonVariants({
                variant: 'ghost',
                size: 'icon',
                class: 'self-center',
            })}
            href={index()}
            data={page.props.query}
        >
            <ArrowLeft class="w-6 h-6" />
        </Link>
        <div class="flex items-center justify-between gap-4 self-center">
            <h1 class="text-3xl font-bold tracking-tight">
                {restaurantData.name}
            </h1>

            {#if restaurantData.average_rating != null}
                <span
                    class="flex items-center gap-1 text-lg font-semibold shrink-0"
                    aria-label="Average rating: {restaurantData.average_rating.toFixed(
                        1,
                    )} out of 5"
                >
                    <Star
                        class="size-5 fill-yellow-400 text-yellow-400"
                        aria-hidden="true"
                    />
                    {restaurantData.average_rating.toFixed(1)}
                </span>
            {/if}
        </div>

        <div class="flex justify-center items-start w-full self-center">
            <MapPin class="h-5 w-5 text-muted-foreground" />
        </div>

        <p class="text-muted-foreground text-lg leading-snug self-center">
            {restaurantData.tags['addr:street']}
            {restaurantData.tags['addr:housenumber']}
            , {restaurantData.tags['addr:city']}
            {restaurantData.tags['addr:postcode']}
        </p>
    </header>

    <div class="w-full px-12">
        {#if restaurantData.photos && restaurantData.photos.length > 0}
            <Carousel.Root class="w-full">
                <Carousel.Content>
                    {#each restaurantData.photos as img, i (img.id)}
                        <Carousel.Item class="basis-[85%]">
                            <Card.Root
                                class="overflow-hidden border-0 shadow-none p-0"
                            >
                                <Card.Content
                                    class="p-0 aspect-auto items-center justify-center rounded-xl overflow-hidden bg-muted"
                                >
                                    <img
                                        src={img.url}
                                        alt="Restaurant photo {i + 1}"
                                        loading="lazy"
                                        decoding="async"
                                        class="object-cover w-full h-full aspect-video"
                                    />
                                </Card.Content>
                            </Card.Root>
                        </Carousel.Item>
                    {/each}
                </Carousel.Content>

                <Carousel.Previous />
                <Carousel.Next />
            </Carousel.Root>
        {:else}
            <Empty.Root>
                <Empty.Header>
                    <Empty.Media variant="icon">
                        <ImagePlus />
                    </Empty.Media>

                    <Empty.Title>No photos yet</Empty.Title>
                </Empty.Header>

                <Empty.Content>
                    <Link
                        href={edit(restaurantData)}
                        class={buttonVariants({ variant: 'outline' })}
                    >
                        Add a photo
                    </Link>
                </Empty.Content>
            </Empty.Root>
        {/if}
    </div>

    <OsmDataDetailContainer {restaurantData} />

    <ActionNav {restaurantData} />

    <Tabs.Root value="menu">
        <Tabs.List class="w-full">
            <Tabs.Trigger value="menu">Menu</Tabs.Trigger>

            <Tabs.Trigger value="reviews">Reviews</Tabs.Trigger>
        </Tabs.List>

        <Tabs.Content value="menu" class="-mx-1">
            <MenuItemList {menuItems} {restaurantData} {allergens} />
        </Tabs.Content>

        <Tabs.Content value="reviews">
            <ReviewList {reviews} {restaurantData} />
        </Tabs.Content>
    </Tabs.Root>
</div>
