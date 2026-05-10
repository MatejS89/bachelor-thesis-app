import { page } from '@inertiajs/svelte';
import type { Filters } from '@/types';

export class StateManager {
    allergenIDs: string[] = $state(
        (page.props.query?.allergens as string[] | undefined)?.map(String) ??
            [],
    );

    mapShown: boolean = $state(false);

    public get filters(): Filters {
        return {
            allergens: this.allergenIDs,
        };
    }
}
