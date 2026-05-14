import { useHttp } from '@inertiajs/svelte';
import type { FeatureCollection, Point } from 'geojson';
import { filter } from '@/routes/map';
import type { StateManager } from '@/state/state-manager.svelte';

export type FetchManagerOptions = {
    stateManager: StateManager;
    onSuccess: (data: FeatureCollection<Point>) => void;
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
                const fc = data as FeatureCollection<Point>;

                this.featureData = fc;
                this.options.onSuccess(fc);
            },
        });
    };
}
