import { createContext } from 'svelte';
import type { MapManager } from '@/hooks/map-manager.svelte';
import type { NavigationManager } from '@/hooks/navigation-manager.svelte';
import type { SearchManager } from '@/hooks/search-result-manager.svelte';

interface AppState {
    mapManager: MapManager;
    searchManager: SearchManager;
    navigationManager: NavigationManager;
}

export const [getAppContext, setAppContext] = createContext<AppState>();
