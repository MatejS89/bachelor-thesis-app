<script lang="ts">
    import { Badge } from '@/components/ui/badge/index';
    import * as Card from '@/components/ui/card/index';

    let { menuItems } = $props();
</script>

<Card.Root>
    <Card.Header>
        <Card.Title>Our Menu</Card.Title>
        <Card.Description>Explore our delicious offerings</Card.Description>
    </Card.Header>
    <Card.Content>
        <div class="space-y-6">
            {#each menuItems as item (item.id)}
                <div
                    class="flex justify-between items-start border-b border-border/50 pb-4 last:border-0 last:pb-0">
                    <div class="pr-4">
                        <h4 class="font-medium text-foreground">{item.name}</h4>
                        <p class="text-sm text-muted-foreground mt-1 leading-relaxed">{item.description}</p>
                        <Badge variant="secondary"
                               class="mt-2 text-xs font-normal">{item.category}</Badge>
                    </div>
                    <span class="font-semibold whitespace-nowrap">{item.price}</span>
                </div>
            {/each}
            {#if menuItems.length === 0}
                <p class="text-sm text-muted-foreground italic">Menu coming soon.</p>
            {/if}
        </div>
    </Card.Content>
</Card.Root>
