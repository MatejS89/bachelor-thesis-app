import { router, page } from '@inertiajs/svelte';
import { index } from '@/routes/map';
import type { BoundingBox } from '@/types';

export class NavigationManager {
    currentParams = $state<Record<string, any>>({});

    constructor() {
        this.currentParams = page.props.filters;
    }

    navigate = (newParams: Record<string, any>, options: any = {}) => {
        this.currentParams = { ...this.currentParams, ...newParams };

        router.reload({
            data: this.currentParams,
            ...options,
        });
    };

    updateBounds = (bounds: BoundingBox) => {
        this.navigate(bounds, {
            preserveState: true,
            reset: ['visibleFeatures'],
            only: ['visibleFeatures', 'mapFeatures'],
        });
    };

    updateAllergens = (
        allergens: string[],
        bounds: BoundingBox | undefined,
    ) => {
        this.navigate(
            { allergens, ...bounds },
            {
                preserveState: true,
                preserveScroll: true,
            },
        );
    };
}
