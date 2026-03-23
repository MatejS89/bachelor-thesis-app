import { router } from '@inertiajs/svelte';

export function selectPlace(id: number | null) {
    const params = new URLSearchParams(window.location.search);

    const url = id
        ? `/map/${id}?${params.toString()}`
        : `/map?${params.toString()}`;

    router.get(
        url,
        {},
        {
            preserveState: true,
            preserveScroll: true,
            only: ['selectedFeature'],
        },
    );
}
