import type { Point, Feature, Position } from 'geojson';

export class SearchManager {
    query = $state('');
    localResults = $state<Feature[]>([]);
    nominatimResults = $state<Feature[]>([]);
    isSearching = $state(false);

    get showDropdown() {
        return this.localResults.length > 0 || this.nominatimResults.length > 0;
    }

    async search(userLocation?: { lat: number; lng: number } | null) {
        const trimmedQuery = this.query.trim();

        if (!trimmedQuery) {
            this.clear();

            return [];
        }

        this.isSearching = true;

        // if (userLocation) {
        //     const { lat, lng } = userLocation;
        //     nominatimQuery = `${trimmedQuery} [${lat}, ${lng}]`;
        // }

        const nominatimUrl = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
            trimmedQuery,
        )}&format=geojson&dedupe=1&polygon_geojson=1&addressdetails=1`;

        const localUrl = `/map/search?search=${encodeURIComponent(trimmedQuery)}`;

        try {
            const [nominatimRes, serverRes] = await Promise.all([
                fetch(nominatimUrl).then((res) => res.json()),
                fetch(localUrl).then((res) => res.json()),
            ]);

            const formattedLocal: Feature<Point>[] = [];
            const formattedNominatim: Feature<Point>[] = [];

            for (const dbItem of serverRes as any[]) {
                const [lat, lng] = dbItem.geom.coordinates;

                formattedLocal.push({
                    type: 'Feature',
                    geometry: { type: 'Point', coordinates: [lat, lng] },
                    properties: {
                        ...dbItem,
                        display_name: dbItem.name,
                    },
                    id: dbItem.id,
                });
            }

            for (const feature of nominatimRes.features || []) {
                const center: Position = feature.bbox
                    ? [
                          feature.bbox[0] +
                              (feature.bbox[2] - feature.bbox[0]) / 2,
                          feature.bbox[1] +
                              (feature.bbox[3] - feature.bbox[1]) / 2,
                      ]
                    : feature.geometry.coordinates;

                const nameParts = feature.properties.display_name.split(', ');

                formattedNominatim.push({
                    type: 'Feature',
                    geometry: {
                        type: 'Point',
                        coordinates: center,
                    },
                    bbox: feature.bbox,
                    id: feature.properties.osm_id,
                    properties: {
                        ...feature.properties,
                        name: feature.properties.name || nameParts[0],
                        secondary_info: nameParts.slice(1).join(', '),
                    },
                });
            }

            this.localResults = formattedLocal;
            this.nominatimResults = formattedNominatim;

            return [...this.localResults, ...this.nominatimResults];
        } catch (error) {
            console.error('Combined geocoding request failed:', error);
            this.clear();

            return [];
        } finally {
            this.isSearching = false;
        }
    }

    clear() {
        this.localResults = [];
        this.nominatimResults = [];
        this.query = '';
    }
}
