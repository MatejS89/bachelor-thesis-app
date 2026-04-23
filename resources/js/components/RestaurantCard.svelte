<script lang="ts">
    import { Link } from '@inertiajs/svelte';
    import OpeningBadge from '@/components/OpeningBadge.svelte';
    import { Badge } from '@/components/ui/badge';
    import * as Item from '@/components/ui/item/index';
    import { show } from '@/routes/map';
    import { getAppContext } from '@/state/appState.svelte';
    import type { StatusColor } from '@/utils/get_color';
    import { getRatioColor } from '@/utils/get_color';

    let { feature, filters, stats } = $props();

    let mapManager = getAppContext().mapManager;

    let status = $derived(() => getRatioColor(stats?.safe_items_count ?? 0, stats?.total_items_count ?? 0) as StatusColor);

    const borderClasses: Record<StatusColor, string> = {
        green: 'border-green-500 hover:border-green-600',
        orange: 'border-orange-500 hover:border-orange-600',
        red: 'border-red-500 hover:border-red-600',
        neutral: 'border-border hover:border-primary/50'
    };

    const badgeClasses: Record<StatusColor, string> = {
        green: 'bg-green-500 text-white hover:bg-green-600',
        orange: 'bg-orange-500 text-white hover:bg-orange-600',
        red: 'bg-red-500 text-white hover:bg-red-600',
        neutral: 'bg-muted text-muted-foreground hover:bg-muted/80'
    };

    const badgeLabels: Record<StatusColor, string> = {
        green: 'Great Options',
        orange: 'Some Options',
        red: 'Few Options',
        neutral: 'No Data'
    };
</script>

<li
    onmouseenter={() => mapManager.highlightFeature(feature.id)}
    onmouseleave={() => mapManager.highlightFeature(null)}
    class="list-none"
>
    <Link href={show(feature)} data={filters} preserveState
          class="block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-2xl">

        <Item.Root
            class={`p-2 lg:p-3 flex flex-row flex-nowrap justify-start gap-4 bg-card overflow-hidden transition-colors border-2 rounded-2xl ${borderClasses[status()]}`}
        >
            <img
                src="/400.svg"
                class="object-cover aspect-square w-32 sm:w-40 border-r rounded-2xl"
                alt={feature.name ? `Photo of ${feature.name}` : ''}
            />

            <Item.Content class="flex flex-1 flex-col justify-center min-w-0 shrink-0">
                <Item.Title class="text-md lg:text-lg font-semibold ">
                    {feature.name || 'Unnamed location'}
                </Item.Title>

                <Item.Description class="flex flex-col gap-0.5 mt-1 text-sm">
                    <dl class="flex flex-col gap-0.5">
                        <Badge class={`shrink-0 ${badgeClasses[status()]}`}>
                            {badgeLabels[status()]}
                        </Badge>

                        <div class="flex gap-1 items-baseline">
                            <dt class="text-muted-foreground">Total menu items:</dt>
                            <dd class="font-medium text-foreground">{stats?.total_items_count ?? 0}</dd>
                        </div>

                        <div class="flex gap-1 items-baseline">
                            <dt class="text-muted-foreground">Safe menu items:</dt>
                            <dd class="font-medium text-foreground">{stats?.safe_items_count ?? 0}</dd>
                        </div>

                        <div class="mt-1 relative">
                            <dt class="sr-only">Opening hours</dt>
                            <dd>
                                <OpeningBadge
                                    hoursString={feature.tags.opening_hours}
                                />
                            </dd>
                        </div>

                        {#if feature.tags.cuisine}
                            <div class="mt-2 relative">
                                <dt class="sr-only">Cuisines</dt>
                                <dd class="flex flex-wrap gap-1.5">
                                    {#each feature.tags.cuisine.split(';') as cuisine, i(cuisine + feature.id + i)}
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
