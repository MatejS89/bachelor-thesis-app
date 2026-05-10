import { createContext } from 'svelte';
import type { FetchManager } from '@/hooks/fetch-manager.svelte';
import type { MapManager } from '@/hooks/map-manager.svelte';
import type { StateManager} from '@/hooks/state-manager.svelte';

interface AppState {
    mapManager: MapManager;
    fetchManager: FetchManager;
    stateManager: StateManager;
}

export const [getAppContext, setAppContext] = createContext<AppState>();
