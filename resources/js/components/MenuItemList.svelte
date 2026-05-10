<script lang="ts">
    import { Link } from '@inertiajs/svelte';
    import { CirclePlus } from 'lucide-svelte';
    import AllergenFilter from '@/components/AllergenFilter.svelte';
    import MenuItemCard from '@/components/MenuItemCard.svelte';
    import { buttonVariants } from '@/components/ui/button';
    import * as Card from '@/components/ui/card/index';
    import { Checkbox } from '@/components/ui/checkbox';
    import * as Empty from '@/components/ui/empty/index';
    import { Label } from '@/components/ui/label';
    import { create as createMenuItem } from '@/routes/map/menuitem';
    import { getAppContext } from '@/state/appState.svelte';

    let {
        menuItems,
        restaurantData,
        allergens: availableAllergens
    }: {
        menuItems: App.Data.MenuItem.MenuItemData[];
        restaurantData: App.Data.OsmData.OsmFeatureData;
        allergens: App.Data.Allergen.AllergenData[];
    } = $props();

    let { stateManager } = getAppContext();

    let allergens = $derived(stateManager.allergenIDs);

    let hideUnsafeItems = $state(false);

    let visibleMenuItems = $derived(
        hideUnsafeItems && allergens.length > 0
            ? menuItems.filter(
                (item) =>
                    !item.allergens?.some((a) =>
                        allergens.includes(a.id.toString())
                    )
            )
            : menuItems
    );
</script>

<Card.Root>
    <Card.Header class="flex flex-wrap items-center justify-between gap-2">
        <Card.Title>Menu</Card.Title>

        {#if allergens.length > 0 && menuItems.length > 0}
            <div class="flex items-center gap-2">
                <Checkbox
                    id="hide-unsafe-items"
                    bind:checked={hideUnsafeItems}
                />
                <Label
                    for="hide-unsafe-items"
                    class="text-sm font-normal cursor-pointer"
                >
                    Hide items with my allergens
                </Label>
            </div>
        {/if}
    </Card.Header>

    <AllergenFilter allergens={availableAllergens} />

    <Card.Content class="px-2">
        {#if visibleMenuItems.length > 0}
            <ul class="flex flex-col gap-4">
                {#each visibleMenuItems as menuItem (menuItem.id)}
                    <MenuItemCard {menuItem} {allergens} />
                {/each}
            </ul>
        {:else if menuItems.length > 0}
            <p class="text-sm text-muted-foreground py-4 text-center">
                All menu items contain at least one of your allergens.
            </p>
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
