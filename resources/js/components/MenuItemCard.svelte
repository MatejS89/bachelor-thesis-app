<script lang="ts">
    import { Image } from 'lucide-svelte';
    import { Badge } from '@/components/ui/badge/index';
    import * as Card from '@/components/ui/card/index';
    import * as Item from '@/components/ui/item/index';

    let { menuItem }: { menuItem: App.Data.MenuItemData } = $props();

    const baseBadgeClass = 'px-1.5 text-xs md:text-sm uppercase font-semibold';

    interface TagItem {
        id: string | number;
        name: string;
    }
</script>

{#snippet badgeList(items: TagItem[] | undefined, variant: "outline" | "destructive", extraClasses: string = "")}
    {#if items && items.length > 0}
        <ul class="flex flex-row flex-wrap items-center gap-1 md:gap-2">
            {#each items as item (item.id)}
                <li>
                    <Badge {variant} class="{baseBadgeClass} {extraClasses}">
                        {item.name}
                    </Badge>
                </li>
            {/each}
        </ul>
    {/if}
{/snippet}

<Item.Root class="gap-4" variant="outline">
    <Item.Media class="w-28 md:w-40 shrink-0">
        {#if menuItem.photoUrl}
            <img
                src={menuItem.photoUrl}
                alt={menuItem.name}
                class="object-center aspect-square object-cover rounded-md w-full">
        {:else}
            <div class="aspect-square rounded-md bg-muted w-full flex justify-center items-center">
                <Image class="text-muted-foreground"></Image>
            </div>
        {/if}
    </Item.Media>

    <Item.Content class="flex-1 min-w-0">
        <Item.Title class="flex flex-row gap-1 md:gap-2 items-center text-sm md:text-base flex-wrap">
            <span class="truncate">{menuItem.name}</span>

            {@render badgeList(
                menuItem.dietaryTags,
                "outline",
                "text-green-600 dark:text-green-400 border-green-600/30"
            )}
        </Item.Title>

        <div class="mt-1">
            {@render badgeList(
                menuItem.allergens,
                "destructive"
            )}
        </div>

        <Card.Description class="text-sm md:text-md leading-relaxed">
            {menuItem.description}
        </Card.Description>

    </Item.Content>
</Item.Root>
