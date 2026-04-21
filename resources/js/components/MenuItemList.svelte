<script lang="ts">
    import MenuItemCard from '@/components/MenuItemCard.svelte';
    import * as Card from '@/components/ui/card/index';

    let { menuItems }: { menuItems: App.Data.MenuItemData[] } = $props();
</script>

<Card.Root>
    <Card.Header>
        <Card.Title>Our Menu</Card.Title>
        <Card.Description>Explore our delicious offerings</Card.Description>
    </Card.Header>

    <Card.Content>
        {#if menuItems.length > 0}
            <ul class="flex flex-col gap-4">
                {#each menuItems as item (item.id)}
                    <li>
                        <MenuItemCard {item} />
                    </li>
                {/each}
            </ul>
        {:else}
            <div class="py-8 text-center text-muted-foreground">
                <p class="text-sm italic">No menu items.</p>
            </div>
        {/if}
    </Card.Content>
</Card.Root>
