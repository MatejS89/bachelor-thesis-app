<script lang="ts">
    import { Link } from '@inertiajs/svelte';
    import {
        ExternalLink,
        SquarePen,
        Star,
        UtensilsCrossed
    } from 'lucide-svelte';
    import { buttonVariants } from '@/components/ui/button';
    import createNavigationLink from '@/lib/navigation';
    import { edit } from '@/routes/map';
    import { create as createMenuItem } from '@/routes/map/menuitem';
    import { create as createReview } from '@/routes/map/review';

    let { restaurantData }: { restaurantData: App.Data.OsmData.OsmFeatureData } =
        $props();
</script>

<nav class="w-full flex flex-row justify-between gap-1.5 flex-wrap">
    <a
        class={buttonVariants({
            variant: 'default',
            class: 'flex-1 flex-col h-auto py-3 gap-1.5',
        })}
        href={createNavigationLink(restaurantData.geom.coordinates[0], restaurantData.geom.coordinates[1])}
        target="_blank"
    >
        <ExternalLink class="h-5 w-5" />
        Navigate
    </a>

    <Link
        class={buttonVariants({
            variant: 'default',
            class: 'flex-1 flex-col h-auto py-3 gap-1.5',
        })}
        href={createReview(restaurantData)}
    >
        <Star class="h-5 w-5" />
        Add review
    </Link>

    <Link
        href={createMenuItem(restaurantData)}
        class={buttonVariants({
            variant: 'default',
            class: 'flex-1 flex-col h-auto py-3 gap-1.5',
        })}
    >
        <UtensilsCrossed class="h-5 w-5" />
        Add menu item
    </Link>

    <Link
        href={edit(restaurantData)}
        class={buttonVariants({
            variant: 'default',
            class: 'flex-1 flex-col h-auto py-3 gap-1.5',
        })}
    >
        <SquarePen class="h-5 w-5" />
        Edit details
    </Link>
</nav>
