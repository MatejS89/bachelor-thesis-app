<script lang="ts">
    import { CircleAlert } from '@lucide/svelte';
    import { CircleCheck, Image } from 'lucide-svelte';
    import { Badge } from '@/components/ui/badge/index';
    import * as Item from '@/components/ui/item/index';

    let {
        menuItem,
        allergens
    }: {
        menuItem: App.Data.MenuItem.MenuItemData;
        allergens: string[];
    } = $props();

    let containsAllergens = $derived(
        menuItem.allergens?.some((allergen) =>
            allergens.includes(allergen.id.toString())
        ) ?? false
    );
</script>

<Item.Root
    class="gap-4 border-2 bg-sidebar border-primary"
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
                <Badge
                    variant={containsAllergens ? 'destructive' : 'success'}
                    class="h-auto text-sm lg:text-base {containsAllergens ? 'font-semibold' : ''}"
                >
                    {#if containsAllergens}
                        <CircleAlert />
                    {:else}
                        <CircleCheck />
                    {/if}
                    {containsAllergens ? 'Not Safe' : 'Safe'}
                </Badge>

                <Item.Title
                    class="flex flex-row gap-1 md:gap-2 text-lg md:text-lg flex-wrap items-baseline font-semibold"
                >
                    <span class="wrap-anywhere min-w-0">{menuItem.name}</span>

                    {#if menuItem.dietaryTags && menuItem.dietaryTags.length > 0}
                        <ul class="flex flex-row flex-wrap gap-1">
                            {#each menuItem.dietaryTags as dietaryTag (dietaryTag.id)}
                                <Badge
                                    variant="outline"
                                    class="h-auto text-sm md:text-base whitespace-normal text-center leading-tight px-1.5"
                                >
                                    {dietaryTag.name}
                                </Badge>
                            {/each}
                        </ul>
                    {/if}
                </Item.Title>

                {#if menuItem.allergens && menuItem.allergens.length > 0}
                    <div class="flex flex-row gap-2 items-center">
                        <ul class="flex flex-row flex-wrap items-center gap-1 mt-1">
                            <li>Contains:</li>
                            {#each menuItem.allergens as allergen (allergen.id)}
                                {@const containsCurrAllergen = allergens.includes(
                                    allergen.id.toString(),
                                )}
                                <Badge
                                    variant={containsCurrAllergen ? "destructive" : "outline"}
                                    class="h-auto text-sm md:text-base whitespace-normal text-center leading-tight {containsCurrAllergen ? 'font-semibold' : ''}"
                                >

                                    {#if containsCurrAllergen}
                                        <CircleAlert />
                                    {/if}

                                    {allergen.name}
                                </Badge>
                            {/each}
                        </ul>
                    </div>
                {/if}

                <Item.Description class="text-sm md:text-md leading-relaxed">
                    {menuItem.description}
                </Item.Description>
            </Item.Content>
        </li>
    {/snippet}
</Item.Root>
