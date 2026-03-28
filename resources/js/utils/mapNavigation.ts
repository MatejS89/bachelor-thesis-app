import { router } from '@inertiajs/svelte';
import { show } from '@/routes/feature';

export function selectPlace(id: number | null) {
    const url = show.url(id ? { feature: id } : {});

    const currentParams = Object.fromEntries(
        new URLSearchParams(window.location.search),
    );

    router.get(url, currentParams, {
        preserveState: true,
        preserveScroll: true,
        only: ['selectedFeature'],
    });
}
