import type { BBox, Feature, Point } from 'geojson';
import { search as searchRoute } from '@/routes/map';

const EXCLUDED_OSM_KEYS = ['amenity'];

type PhotonProps = {
    osm_id: number;
    osm_type: string;
    osm_key?: string;
    osm_value?: string;
    name?: string;
    street?: string;
    housenumber?: string;
    postcode?: string;
    city?: string;
    district?: string;
    state?: string;
    county?: string;
    country?: string;
    extent?: [number, number, number, number];
};

function formatPhotonAddress(props: PhotonProps) {
    const street = [props.street, props.housenumber].filter(Boolean).join(' ');

    const parts = [
        props.name,
        street || null,
        props.postcode,
        props.city,
        props.district,
        props.county,
        props.state,
        props.country,
    ].filter((p): p is string => Boolean(p));

    const unique = parts.filter((p, i) => p !== parts[i - 1]);

    const name = unique[0] ?? 'Unknown location';
    const secondary_info = unique.slice(1).join(', ');
    const display_name = unique.join(', ');

    return { name, secondary_info, display_name };
}

export class SearchManager {
    query = $state('');
    localResults = $state<Feature[]>([]);
    photonResults = $state<Feature[]>([]);
    isSearching = $state(false);
    showDropdown = $state(false);
    results = $state<Feature[]>([]);

    async search(userLocation?: { lat: number; lng: number } | null) {
        const trimmedQuery = this.query.trim();

        if (!trimmedQuery) {
            this.clear();

            return [];
        }

        this.isSearching = true;

        const photonParams = new URLSearchParams({
            q: trimmedQuery,
            limit: '5',
            lang: 'en',
        });

        for (const key of EXCLUDED_OSM_KEYS) {
            photonParams.append('osm_tag', `!${key}`);
        }

        if (userLocation) {
            photonParams.set('lat', String(userLocation.lat));
            photonParams.set('lon', String(userLocation.lng));
        }

        const photonUrl = `https://photon.komoot.io/api/?${photonParams.toString()}`;

        const localParams: App.Data.OsmData.SearchOsmDataData = {
            search: trimmedQuery,
        };

        const localUrl = `${searchRoute().url}?${new URLSearchParams(localParams).toString()}`;

        try {
            const [photonRes, serverRes] = await Promise.all([
                fetch(photonUrl).then((res) => res.json()),
                fetch(localUrl).then((res) => res.json()),
            ]);

            const formattedLocal: Feature<Point>[] = [];
            const photonById = new Map<string, Feature<Point>>();

            for (const dbItem of serverRes as App.Data.OsmData.OsmSearchResultData[]) {
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

            for (const feature of photonRes.features || []) {
                const props = feature.properties as PhotonProps;

                if (
                    props.osm_key &&
                    EXCLUDED_OSM_KEYS.includes(props.osm_key)
                ) {
                    continue;
                }

                const ext = props.extent;
                const bbox: BBox | undefined = ext
                    ? [ext[0], ext[3], ext[2], ext[1]]
                    : undefined;

                const { name, secondary_info, display_name } =
                    formatPhotonAddress(props);

                const id = `${props.osm_type}${props.osm_id}`;

                photonById.set(id, {
                    type: 'Feature',
                    geometry: feature.geometry as Point,
                    bbox,
                    id,
                    properties: {
                        ...props,
                        name,
                        secondary_info,
                        display_name,
                    },
                });
            }

            this.localResults = formattedLocal;
            this.photonResults = [...photonById.values()];

            this.results = [...this.localResults, ...this.photonResults];

            return [...this.localResults, ...this.photonResults];
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
        this.photonResults = [];
        this.query = '';
    }
}
