<script lang="ts">
    import { Link } from '@inertiajs/svelte';
    import { SquarePen, Star, UtensilsCrossed } from 'lucide-svelte';
    import { Button, buttonVariants } from '@/components/ui/button';
    import { create as createMenuItem } from '@/routes/map/menu-item';
    import { create as createReview } from '@/routes/map/review';

    let { restaurantData }: { restaurantData: App.Data.OsmFeatureData } = $props();
</script>

<nav class="w-full flex flex-row justify-between gap-1.5">
    <Link
        class={buttonVariants({ variant: "default", class: "flex-1 flex-col h-auto py-3 gap-1.5" })}
        as="button"
        href={createReview(restaurantData)}
    >
        <Star class="h-5 w-5" />
        <span class="text-xs">Add review</span>
    </Link>

    <Link
        href={createMenuItem(restaurantData)}
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
