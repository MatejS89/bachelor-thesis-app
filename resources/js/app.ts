import { createInertiaApp, router } from '@inertiajs/svelte';
import { hydrate, mount } from 'svelte';
import '../css/app.css';
import FullScreenLayout from '@/layouts/FullScreenLayout.svelte';
import MapLayout from '@/layouts/MapLayout.svelte';
import { initializeTheme } from '@/state/theme.svelte.js';

const appName = import.meta.env.VITE_APP_NAME || 'Laravel';

createInertiaApp({
    title: (title) => (title ? `${title} - ${appName}` : appName),
    resolve: (name) => {
        const pages = import.meta.glob('./pages/**/*.svelte', {
            eager: true,
        });

        return pages[`./pages/${name}.svelte`] as never;
    },
    layout: (name) => {
        if (
            name.startsWith('map') ||
            name.startsWith('review') ||
            name.startsWith('menuItem') ||
            name.startsWith('osmData')
        ) {
            return [FullScreenLayout, MapLayout];
        }

        return [FullScreenLayout];
    },
    setup({ el, App, props }) {
        if (!el) {
            return;
        }

        if (el.dataset.serverRendered === 'true') {
            hydrate(App, { target: el, props });
        } else {
            mount(App, { target: el, props });
        }
    },
    progress: {
        color: '#4B5563',
    },
});

router.on('before', (event) => {
    const isMapRoute = window.location.pathname.startsWith('/map');

    if (isMapRoute && window.location.hash) {
        event.detail.visit.url.hash = window.location.hash;
    }
});

// This will set light / dark mode on page load...
initializeTheme();
