<script lang="ts">
    import { Link, page } from '@inertiajs/svelte';
    import { CirclePlus } from 'lucide-svelte';
    import MenuItemCard from '@/components/MenuItemCard.svelte';
    import { buttonVariants } from '@/components/ui/button';
    import * as Card from '@/components/ui/card/index';
    import * as Empty from '@/components/ui/empty/index';
    import { create as createMenuItem } from '@/routes/map/menuitem';

    let { menuItems, restaurantData }: {
        menuItems: App.Data.MenuItemData[],
        restaurantData: App.Data.OsmFeatureData
    } = $props();

    let allergens = page.props.query?.allergens ?? [];
</script>

<Card.Root>
    <Card.Header>
        <Card.Title>Menu</Card.Title>
    </Card.Header>

    <Card.Content class="px-2">
        {#if menuItems.length > 0}
            <ul class="flex flex-col gap-4">
                {#each menuItems as menuItem (menuItem.id)}
                    <li>
                        <MenuItemCard {allergens} {menuItem} />
                    </li>
                {/each}
            </ul>
        {:else}
            <Empty.Root>
                <Empty.Header>
                    <Empty.Media variant="icon">
                        <CirclePlus />
                    </Empty.Media>

                    <Empty.Title>No menu items yet</Empty.Title>
                </Empty.Header>

                <Empty.Content>
                    <Link
                        href={createMenuItem(restaurantData)}
                        class={buttonVariants({ variant: 'outline' })}
                    >
                        Add a menu item
                    </Link>
                </Empty.Content>
            </Empty.Root>
        {/if}
    </Card.Content>
</Card.Root>
