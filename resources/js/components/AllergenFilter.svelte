<script lang="ts">
    import { page, router, useRemember } from '@inertiajs/svelte';
    import { ChevronDown, ChevronUp } from 'lucide-svelte';
    import { Button } from '@/components/ui/button';
    import * as Collapsible from '@/components/ui/collapsible';
    import * as ToggleGroup from '@/components/ui/toggle-group';
    import { index } from '@/routes/map';
    import { getAppContext } from '@/state/appState.svelte';

    let { allergens } = $props();

    let mapManager = getAppContext().mapManager;

    let allergenArr = $derived((page.props.query?.allergens ?? []).map(String));

    const allergenDropdownState = useRemember({
        isOpen: true,
    });

    function handleAllergenChange(allergens: string[]) {
        const filters = { ...page.props.query };

        if (allergens && allergens.length > 0) {
            filters.allergens = allergens;
        } else {
            delete filters.allergens;
        }

        const queryString = new URLSearchParams(filters).toString();
        const currentHash = window.location.hash;

        const finalUrl = queryString
            ? `${index().url}?${queryString}${currentHash}`
            : `${index().url}${currentHash}`;

        router.replace({
            url: finalUrl,
            props: (currentProps) => ({
                ...currentProps,
                query: {
                    ...filters,
                },
            }),
        });

        mapManager.fetchFeaturesForCurrentBounds(filters);
    }
</script>

<Collapsible.Root
    bind:open={allergenDropdownState.isOpen}
    class="w-full px-3 py-2"
>
    <Collapsible.Trigger>
        <div class="flex items-center justify-between w-full">
            <h4 class="text-sm font-medium leading-none">Allergen Filters</h4>

            <Button variant="ghost" size="sm" class="w-9 p-0">
                {#if allergenDropdownState.isOpen}
                    <ChevronUp class="h-4 w-4" />
                {:else}
                    <ChevronDown class="h-4 w-4" />
                {/if}
                <span class="sr-only">Toggle allergen filters</span>
            </Button>
        </div>
    </Collapsible.Trigger>

    <Collapsible.Content>
        <ToggleGroup.Root
            type="multiple"
            value={allergenArr}
            onValueChange={handleAllergenChange}
            spacing={2}
            class="flex flex-wrap pt-2"
            variant="outline"
        >
            {#each allergens as allergen (allergen.id)}
                <ToggleGroup.Item
                    value={allergen.id.toString()}
                    aria-label="Toggle {allergen.name}"
                    class="data-[state=on]:bg-primary data-[state=on]:text-primary-foreground hover:data-[state=on]:bg-primary/90"
                >
                    {allergen.name}
                </ToggleGroup.Item>
            {/each}
        </ToggleGroup.Root>
    </Collapsible.Content>
</Collapsible.Root>
