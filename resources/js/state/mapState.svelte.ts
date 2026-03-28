import { createContext } from 'svelte';

type OsmGeoJSONCollectionData = App.Data.OsmGeoJSONCollectionData;
type OsmDetailData = App.Data.OsmDetailData;

export interface MapState {
    visibleFeatures: OsmGeoJSONCollectionData;
    selectedFeature?: OsmDetailData;
}

export const [getMapContext, setMapContext] = createContext<MapState>();
