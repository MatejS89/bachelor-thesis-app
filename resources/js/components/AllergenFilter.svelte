<script lang="ts">
    import { router, useRemember } from '@inertiajs/svelte';
    import { ChevronDown, ChevronUp } from 'lucide-svelte';
    import qs from 'qs';
    import { Button } from '@/components/ui/button';
    import * as Collapsible from '@/components/ui/collapsible';
    import * as ToggleGroup from '@/components/ui/toggle-group';
    import { getAppContext } from '@/state/appState.svelte';

    let { allergens } = $props();

    let { stateManager, fetchManager } = getAppContext();

    const allergenDropdownState = useRemember({
        isOpen: true
    });

    function handleAllergenChange() {
        const queryString = qs.stringify(stateManager.filters, { arrayFormat: 'brackets' });
        const currentHash = window.location.hash;
        const currentPath = window.location.pathname;

        const finalUrl = queryString
            ? `${currentPath}?${queryString}${currentHash}`
            : `${currentPath}${currentHash}`;

        router.replace({
            url: finalUrl,
            preserveScroll: true,
            preserveState: true,
            props: (currentProps) => ({
                ...currentProps
            })
        });

        fetchManager.fetchFeaturesForCurrentBounds();
    }
</script>

<Collapsible.Root
    bind:open={allergenDropdownState.isOpen}
    class="w-full"
>
    <Collapsible.Trigger
        class="flex items-center justify-between w-full"
    >
        <h4 class="text-sm font-medium leading-none">Allergen Filters</h4>

        <span class="inline-flex items-center justify-center w-9 h-9">
            {#if allergenDropdownState.isOpen}
                <ChevronUp class="h-4 w-4" />
            {:else}
                <ChevronDown class="h-4 w-4" />
            {/if}
        </span>
    </Collapsible.Trigger>

    <Collapsible.Content>
        <ToggleGroup.Root
            type="multiple"
            bind:value={stateManager.allergenIDs}
            onValueChange={handleAllergenChange}
            spacing={2}
            class="flex flex-wrap pb-2"
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
