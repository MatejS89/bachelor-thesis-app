<script lang="ts">
    import { Badge } from '@/components/ui/badge/index';
    import * as Card from '@/components/ui/card/index';

    let { item }: { item: App.Data.MenuItemData } = $props();
</script>

<Card.Root class="gap-2">
    <Card.Header class="flex flex-row gap-3 items-center">
        <h4 class="text-lg font-semibold leading-none tracking-tight text-foreground">
            {item.name}
        </h4>

        {#if item.dietaryTags && item.dietaryTags.length > 0}
            <ul class="flex flex-row items-center gap-2">
                {#each item.dietaryTags as tag(tag.id)}
                    <li>
                        <Badge variant="outline"
                               class="text-green-600 dark:text-green-400 border-green-600/30 uppercase">
                            {tag.name}
                        </Badge>
                    </li>
                {/each}
            </ul>
        {/if}
    </Card.Header>

    <Card.Content class="flex gap-2 flex-col">
        <Card.Description class="text-sm leading-relaxed">
            {item.description}
        </Card.Description>

        {#if item.allergens && item.allergens.length > 0}
            <ul class="flex items-center gap-2 mt-1">
                {#each item.allergens as allergen(allergen.id)}
                    <li>
                        <Badge variant="destructive"
                               class="h-5 px-1.5 text-[10px] uppercase font-semibold">
                            {allergen.name}
                        </Badge>
                    </li>
                {/each}
            </ul>
        {/if}
    </Card.Content>
</Card.Root>
