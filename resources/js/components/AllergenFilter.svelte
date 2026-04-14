<script lang="ts">
    import { router } from '@inertiajs/svelte';
    import * as ToggleGroup from '@/components/ui/toggle-group';
    import { index } from '@/routes/map';
    import { getAppContext } from '@/state/appState.svelte';

    let { allergens, filters } = $props();

    let navigationManager = getAppContext().navigationManager;
    let mapManager = getAppContext().mapManager;

    let allergenArr = $derived((filters?.allergens ?? []).map(String));

    function handleAllergenChange(newAllergenArray: string[]) {
        const bounds = mapManager.getBounds();

        router.get(index(),
            { allergens: newAllergenArray, ...bounds },
            {
                preserveState: true,
                preserveScroll: true,
                reset: ['visibleFeatures'],
                only: ['visibleFeatures', 'mapFeatures']
            }
        );
    }

</script>

<ToggleGroup.Root
    type="multiple"
    bind:value={allergenArr}
    onValueChange={handleAllergenChange}
    spacing={2}
    class="flex flex-wrap p-3"
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
