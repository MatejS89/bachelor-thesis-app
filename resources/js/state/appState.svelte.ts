import { createContext } from 'svelte';
import type { FetchManager } from '@/state/fetch-manager.svelte.js';
import type { MapManager } from '@/state/map-manager.svelte.js';
import type { StateManager } from '@/state/state-manager.svelte.js';

interface AppState {
    mapManager: MapManager;
    fetchManager: FetchManager;
    stateManager: StateManager;
}

export const [getAppContext, setAppContext] = createContext<AppState>();
