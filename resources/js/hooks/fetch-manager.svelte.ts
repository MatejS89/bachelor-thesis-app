import { useHttp } from '@inertiajs/svelte';
import type { FeatureCollection, Point } from 'geojson';
import { filter } from '@/routes/map';
import type { BoundingBox, Filters } from '@/types';

export class FetchManager {
    private http;

    public featureData: FeatureCollection<Point> = $state({
        type: 'FeatureCollection',
        features: [],
    });

    constructor(
        private readonly getFilters: () => Filters,
        private readonly getBounds: () => BoundingBox | undefined,
        private readonly getUserLocation: () => {
            lat: number;
            lng: number;
        } | null,
        private readonly onSuccess: (data: FeatureCollection<Point>) => void,
    ) {
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
        const bounds = this.getBounds();

        if (!bounds) {
            return;
        }

        const filters = this.getFilters();
        const userLocation = this.getUserLocation();

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
                this.onSuccess(fc);
            },
        });
    };
}
