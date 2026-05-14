import { page } from '@inertiajs/svelte';
import type { BoundingBox, Filters } from '@/types';

export class StateManager {
    allergenIDs: string[] = $state(
        (page.props.query?.allergens as string[] | undefined)?.map(String) ??
            [],
    );

    mapShown: boolean = $state(false);

    hideUnsafeRestaurants: boolean = $state(false);

    bounds: BoundingBox | undefined = $state();

    userLocation: { lat: number; lng: number } | null = $state(null);

    public get filters(): Filters {
        return {
            allergens: this.allergenIDs,
        };
    }
}
