<script lang="ts">
    import {
        Accessibility,
        CreditCard,
        Music,
        ShoppingBag,
        UtensilsCrossed,
    } from 'lucide-svelte';
    import BadgeListSection from '@/components/osm-detail/BadgeListSection.svelte';
    import ContactSection from '@/components/osm-detail/ContactSection.svelte';
    import DetailsSection from '@/components/osm-detail/DetailsSection.svelte';
    import HoursSection from '@/components/osm-detail/HoursSection.svelte';
    import IdentitySection from '@/components/osm-detail/IdentitySection.svelte';
    import NotesSection from '@/components/osm-detail/NotesSection.svelte';
    import RawTagsSection from '@/components/osm-detail/RawTagsSection.svelte';
    import TagListSection from '@/components/osm-detail/TagListSection.svelte';
    import * as Card from '@/components/ui/card/index';
    import {
        buildAtmosphereItems,
        buildFacilityItems,
        buildFoodOptionItems,
        buildPaymentItems,
        buildServiceItems,
    } from '@/lib/osm-tag-format';
    import type {OsmDisplayGroup} from '@/lib/osm-tags';

    const ALL_GROUPS: OsmDisplayGroup[] = [
        'details',
        'hours',
        'contact',
        'identity',
        'food_option',
        'service',
        'facility',
        'atmosphere',
        'payment',
        'notes',
        'raw',
    ];

    let {
        restaurantData,
        groups = ALL_GROUPS
    }: {
        restaurantData: App.Data.OsmData.OsmFeatureData;
        groups?: OsmDisplayGroup[];
    } = $props();

    const tags = $derived(restaurantData.tags);
    const isRaw = (g: OsmDisplayGroup) => g === 'raw';

    const bodyGroups = $derived(groups.filter((g) => !isRaw(g)));
    const showRaw = $derived(groups.some(isRaw));
</script>

<Card.Root class="shrink-0 overflow-hidden">
    <Card.Content class="grid gap-5">
        {#each bodyGroups as group (group)}
            {#if group === 'details'}
                <DetailsSection type={restaurantData.type ?? undefined} {tags} />
            {:else if group === 'hours'}
                <HoursSection {tags} />
            {:else if group === 'contact'}
                <ContactSection {tags} />
            {:else if group === 'identity'}
                <IdentitySection {tags} />
            {:else if group === 'food_option'}
                <BadgeListSection
                    icon={UtensilsCrossed}
                    label="Food options"
                    items={buildFoodOptionItems(tags)}
                />
            {:else if group === 'service'}
                <TagListSection
                    icon={ShoppingBag}
                    label="Service"
                    variant="detail"
                    items={buildServiceItems(tags)}
                />
            {:else if group === 'facility'}
                <TagListSection
                    icon={Accessibility}
                    label="Facilities"
                    variant="detail"
                    items={buildFacilityItems(tags)}
                />
            {:else if group === 'atmosphere'}
                <TagListSection
                    icon={Music}
                    label="Atmosphere"
                    variant="detail"
                    items={buildAtmosphereItems(tags)}
                />
            {:else if group === 'payment'}
                <TagListSection
                    icon={CreditCard}
                    label="Payment"
                    variant="status"
                    items={buildPaymentItems(tags)}
                />
            {:else if group === 'notes'}
                <NotesSection {tags} />
            {/if}
        {/each}
    </Card.Content>

    {#if showRaw}
        <Card.Footer class="border-t">
            <RawTagsSection {tags} />
        </Card.Footer>
    {/if}
</Card.Root>
