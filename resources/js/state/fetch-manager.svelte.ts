import { useHttp } from '@inertiajs/svelte';
import type { FeatureCollection, Point } from 'geojson';
import { filter } from '@/routes/map';
import type { StateManager } from '@/state/state-manager.svelte';

export type FetchManagerOptions = {
    stateManager: StateManager;
};

export class FetchManager {
    private http;

    public featureData: FeatureCollection<Point> = $state({
        type: 'FeatureCollection',
        features: [],
    });

    constructor(private readonly options: FetchManagerOptions) {
        this.http = useHttp<App.Data.OsmData.FilterOsmDataData>({
            north: null,
            south: null,
            east: null,
            west: null,
            userLat: null,
            userLng: null,
            allergens: null,
        });
    }

    public get isProcessing(): boolean {
        return this.http.processing;
    }

    public get filteredFeatureCollection(): FeatureCollection<Point> {
        const fc = this.featureData;
        const { hideUnsafeRestaurants, allergenIDs } =
            this.options.stateManager;

        if (!hideUnsafeRestaurants || allergenIDs.length === 0) {
            return fc;
        }

        return {
            ...fc,
            features: fc.features.filter((f) => {
                const total = (f.properties?.total_items_count ?? 0) as number;
                const safe = (f.properties?.safe_items_count ?? 0) as number;

                return total === 0 || safe > 0;
            }),
        };
    }

    public fetchFeaturesForCurrentBounds = () => {
        const { stateManager } = this.options;
        const bounds = stateManager.bounds;

        if (!bounds) {
            return;
        }

        const filters = stateManager.filters;
        const userLocation = stateManager.userLocation;

        this.http.north = bounds.north;
        this.http.south = bounds.south;
        this.http.east = bounds.east;
        this.http.west = bounds.west;
        this.http.userLat = userLocation?.lat ?? null;
        this.http.userLng = userLocation?.lng ?? null;
        this.http.allergens = filters.allergens;

        this.http.post(filter().url, {
            onSuccess: (data) => {
                this.featureData = data as FeatureCollection<Point>;
            },
        });
    };
}
