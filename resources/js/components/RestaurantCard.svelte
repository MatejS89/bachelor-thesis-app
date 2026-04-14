<script lang="ts">
    import { Link } from '@inertiajs/svelte';
    import OpeningBadge from '@/components/OpeningBadge.svelte';
    import { Badge } from '@/components/ui/badge';
    import * as Item from '@/components/ui/item/index';
    import { show } from '@/routes/map';
    import { getAppContext } from '@/state/appState.svelte';

    let { feature, filters, stats } = $props();

    let mapManager = getAppContext().mapManager;
</script>

<li
    onmouseenter={() => mapManager.highlightFeature(feature.id)}
    onmouseleave={() => mapManager.highlightFeature(null)}
    class="list-none"
>
    <Link href={show(feature)} data={filters} preserveState
          class="block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-2xl">
        <Item.Root
            class="justify-start flex gap-4 items-stretch bg-card overflow-hidden hover:border-primary/50 transition-colors border rounded-2xl"
        >
            <Item.Media variant="image" class="shrink-0 w-32 sm:w-40 md:w-48 h-auto">
                <img
                    src="/400.svg"
                    class="object-cover aspect-square w-full h-full border-r"
                    alt={feature.name ? `Photo of ${feature.name}` : ''}
                    width="400"
                    height="400"
                />
            </Item.Media>

            <Item.Content class="flex flex-1 flex-col justify-center py-4 pr-4">
                <Item.Title class="text-base font-semibold line-clamp-1">
                    {feature.name || 'Unnamed location'}
                </Item.Title>

                <Item.Description class="flex flex-col gap-0.5 mt-1 text-sm">
                    <dl class="flex flex-col gap-0.5">
                        <div class="flex gap-1">
                            <dt class="text-muted-foreground">Total menu items:</dt>
                            <dd class="font-medium text-foreground">{stats?.total_items_count ?? 0}</dd>
                        </div>

                        <div class="flex gap-1">
                            <dt class="text-muted-foreground">Safe menu items:</dt>
                            <dd class="font-medium text-foreground">{stats?.safe_items_count ?? 0}</dd>
                        </div>

                        <div class="mt-1 relative">
                            <dt class="sr-only">Opening hours</dt>
                            <dd>
                                <OpeningBadge
                                    hoursString={feature.tags.opening_hours}
                                    lat={feature.lat}
                                    lon={feature.lon}
                                />
                            </dd>
                        </div>

                        {#if feature.tags.cuisine}
                            <div class="mt-2 relative">
                                <dt class="sr-only">Cuisines</dt>
                                <dd class="flex flex-wrap gap-1.5">
                                    {#each feature.tags.cuisine.split(';') as cuisine(cuisine)}
                                        <Badge variant="secondary" class="capitalize font-medium text-xs">
                                            {cuisine.trim().replace(/_/g, ' ')}
                                        </Badge>
                                    {/each}
                                </dd>
                            </div>
                        {/if}
                    </dl>
                </Item.Description>
            </Item.Content>
        </Item.Root>
    </Link>
</li>
