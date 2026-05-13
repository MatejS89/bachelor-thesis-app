<script lang="ts">
    import { Link } from '@inertiajs/svelte';
    import { Image, Star } from 'lucide-svelte';
    import OpeningBadge from '@/components/OpeningBadge.svelte';
    import { Badge } from '@/components/ui/badge';
    import * as Item from '@/components/ui/item/index';
    import type { StatusColor } from '@/lib/get_color';
    import { getRatioColor } from '@/lib/get_color';
    import { show } from '@/routes/map';
    import { getAppContext } from '@/state/appState.svelte';

    let { feature } = $props();

    let { stateManager } = getAppContext();

    function formatDistance(meters: number): string {
        if (meters < 1000) {
            return `${Math.round(meters / 10) * 10} m`;
        }

        return `${(meters / 1000).toFixed(1)} km`;
    }

    let status = $derived(
        () =>
            getRatioColor(
                feature.properties?.safe_items_count ?? 0,
                feature.properties?.total_items_count ?? 0
            ) as StatusColor
    );

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

<Item.Root
    variant="outline"
    class={`gap-4 bg-sidebar px-1.5 py-1.5 border-2 ${borderClasses[status()]}`}
>
    {#snippet child({ props })}
        <Link href={show(feature.id)} data={stateManager.filters} {...props}>
            <Item.Media variant="image" class="w-32 md:w-40 shrink-0 h-full border-accent border">
                {#if feature.properties.thumbnail_url}
                    <img
                        src={feature.properties.thumbnail_url}
                        loading="lazy"
                        class=" object-cover aspect-square"
                        alt={feature.properties.name
                            ? `Photo of ${feature.properties.name}`
                            : ''}
                    />
                {:else}
                    <div
                        class="w-full h-full aspect-square items-center flex outline-muted-foreground bg-muted"
                    >
                        <Image class="flex-1 mx-auto my-auto" />
                    </div>
                {/if}
            </Item.Media>

            <Item.Content class="grid grid-cols-[1fr_auto] gap-x-2">
                <Item.Title class="text-md lg:text-lg font-semibold min-w-0">
                    {feature.properties.name || 'Unnamed location'}
                </Item.Title>

                {#if feature.properties?.average_rating != null || feature.properties?.distance != null}
                    <div class="row-span-2 self-start flex flex-col items-end gap-0.5 shrink-0">
                        {#if feature.properties?.average_rating != null}
                            <span
                                class="flex items-center gap-1 text-sm font-semibold"
                                aria-label="Average rating: {feature.properties.average_rating.toFixed(
                                    1,
                                )} out of 5"
                            >
                                <Star
                                    class="size-4 fill-yellow-400 text-yellow-400"
                                    aria-hidden="true"
                                />
                                {feature.properties.average_rating.toFixed(1)}
                            </span>
                        {/if}

                        {#if feature.properties?.distance != null}
                            <span class="text-xs text-muted-foreground">
                                {formatDistance(feature.properties.distance)}
                            </span>
                        {/if}
                    </div>
                {/if}

                <Item.Description class="col-start-1 flex flex-col gap-0.5 mt-1 text-sm">
                    <dl class="flex flex-col gap-0.5">
                        <Badge class={`shrink-0 ${badgeClasses[status()]}`}>
                            {badgeLabels[status()]}
                        </Badge>

                        <div class="flex gap-1 items-baseline">
                            <dt class="text-muted-foreground">
                                Total menu items:
                            </dt>
                            <dd class="font-medium text-foreground">
                                {feature.properties?.total_items_count ?? 0}
                            </dd>
                        </div>

                        <div class="flex gap-1 items-baseline">
                            <dt class="text-muted-foreground">
                                Safe menu items:
                            </dt>
                            <dd class="font-medium text-foreground">
                                {feature.properties?.safe_items_count ?? 0}
                            </dd>
                        </div>

                        <div class="mt-1 relative">
                            <dt class="sr-only">Opening hours</dt>
                            <dd>
                                <OpeningBadge
                                    hoursString={feature.properties
                                        .opening_hours}
                                />
                            </dd>
                        </div>

                        {#if feature.properties.cuisine}
                            <div class="mt-2 relative">
                                <dt class="sr-only">Cuisines</dt>
                                <dd class="flex flex-wrap gap-1.5">
                                    {#each feature.properties.cuisine.split(';') as cuisine, i (cuisine + feature.id + i)}
                                        <Badge
                                            variant="secondary"
                                            class="capitalize font-medium text-xs"
                                        >
                                            {cuisine.trim().replace(/_/g, ' ')}
                                        </Badge>
                                    {/each}
                                </dd>
                            </div>
                        {/if}
                    </dl>
                </Item.Description>
            </Item.Content>
        </Link>
    {/snippet}
</Item.Root>
