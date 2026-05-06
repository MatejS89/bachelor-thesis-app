<script lang="ts">
    import { Image } from 'lucide-svelte';
    import { Badge } from '@/components/ui/badge/index';
    import * as Card from '@/components/ui/card/index';
    import * as Item from '@/components/ui/item/index';
    import { COLOR_CONFIG } from '@/utils/get_color';

    let {
        menuItem,
        allergens,
        dietaryTags = [],
    }: {
        menuItem: App.Data.MenuItemData;
        allergens: string[];
        dietaryTags: string[];
    } = $props();

    let containsAllergens = $derived(
        menuItem.allergens?.some((allergen) =>
            allergens.includes(allergen.id.toString()),
        ) ?? false,
    );
</script>

<Item.Root
    class="gap-4 border-2"
    style="border-color: {containsAllergens
        ? COLOR_CONFIG.mapColors.red
        : COLOR_CONFIG.mapColors.green}"
    variant="outline"
>
    {#snippet child({ props })}
        <li {...props}>
            <Item.Media variant="image" class="w-28 md:w-40 shrink-0 h-full">
                {#if menuItem.photoUrl}
                    <img
                        src={menuItem.photoUrl}
                        alt={menuItem.name}
                        class="object-center aspect-square object-cover rounded-md w-full"
                    />
                {:else}
                    <div
                        class="w-full h-full aspect-square items-center flex bg-muted outline-accent-foreground"
                    >
                        <Image class="flex-1 mx-auto my-auto" />
                    </div>
                {/if}
            </Item.Media>

            <Item.Content class="flex-1 min-w-0">
                <Item.Title
                    class="flex flex-row gap-1 md:gap-2 items-center text-sm md:text-lg flex-wrap"
                >
                    <span class="truncate">{menuItem.name}</span>

                    {#if menuItem.dietaryTags && menuItem.dietaryTags.length > 0}
                        <ul class="flex flex-row flex-wrap items-center gap-1">
                            {#each menuItem.dietaryTags as dietaryTag (dietaryTag.id)}
                                {@const hexColor = dietaryTags.includes(
                                    dietaryTag.id.toString(),
                                )
                                    ? COLOR_CONFIG.mapColors.red
                                    : COLOR_CONFIG.mapColors.green}
                                <Badge
                                    variant="outline"
                                    class="font-semibold text-xs md:text-sm uppercase whitespace-normal h-auto text-center leading-tight px-1.5"
                                    style="
                                    color: {hexColor};
                                    border-color: {hexColor};"
                                >
                                    {dietaryTag.name}
                                </Badge>
                            {/each}
                        </ul>
                    {/if}
                </Item.Title>

                {#if menuItem.allergens && menuItem.allergens.length > 0}
                    <ul class="flex flex-row flex-wrap items-center gap-1 mt-1">
                        {#each menuItem.allergens as allergen (allergen.id)}
                            {@const hexColor = allergens.includes(
                                allergen.id.toString(),
                            )
                                ? COLOR_CONFIG.mapColors.red
                                : COLOR_CONFIG.mapColors.green}
                            <Badge
                                variant="outline"
                                class="font-semibold text-xs md:text-sm uppercase whitespace-normal h-auto text-center leading-tight px-1.5"
                                style="
                                color: {hexColor};
                                border-color: {hexColor};"
                            >
                                {allergen.name}
                            </Badge>
                        {/each}
                    </ul>
                {/if}

                <Item.Description class="text-sm md:text-md leading-relaxed">
                    {menuItem.description}
                </Item.Description>
            </Item.Content>
        </li>
    {/snippet}
</Item.Root>
