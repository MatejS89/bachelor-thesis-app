declare namespace App {
    namespace Data {
        export type BoundingBox = {
            readonly north: number;
            readonly south: number;
            readonly east: number;
            readonly west: number;
        };
        export type GalleryImageData = {
            id: number;
            url: string;
            thumb_url: string;
            order: number;
        };
        export type OsmDetailData = {
            id: number;
            name: string | null;
            cuisine: string | null;
            street: string | null;
            city: string | null;
            geom: { type: 'Point'; coordinates: [number, number] };
            gallery_images: App.Data.GalleryImageData[];
        };
        export type OsmGeoJSONCollectionData = {
            type: 'FeatureCollection';
            features: App.Data.OsmGeoJSONData[];
        };
        export type OsmGeoJSONData = {
            type: 'Feature';
            id: number;
            geometry: { type: 'Point'; coordinates: [number, number] };
            properties: App.Data.OsmDetailData;
        };
    }
}
declare namespace Illuminate {
    export type CursorPaginator<TKey, TValue> = {
        data: TKey extends string ? Record<TKey, TValue> : TValue[];
        links: {
            url: string | null;
            label: string;
            active: boolean;
        }[];
        meta: {
            path: string;
            per_page: number;
            next_cursor: string | null;
            next_page_url: string | null;
            prev_cursor: string | null;
            prev_page_url: string | null;
        };
    };
    export type CursorPaginatorInterface<TKey, TValue> =
        Illuminate.CursorPaginator<TKey, TValue>;
    export type LengthAwarePaginator<TKey, TValue> = {
        data: TKey extends string ? Record<TKey, TValue> : TValue[];
        links: {
            url: string | null;
            label: string;
            active: boolean;
        }[];
        meta: {
            total: number;
            current_page: number;
            first_page_url: string;
            from: number | null;
            last_page: number;
            last_page_url: string;
            next_page_url: string | null;
            path: string;
            per_page: number;
            prev_page_url: string | null;
            to: number | null;
        };
    };
    export type LengthAwarePaginatorInterface<TKey, TValue> =
        Illuminate.LengthAwarePaginator<TKey, TValue>;
}
declare namespace Spatie {
    namespace LaravelData {
        export type CursorPaginatedDataCollection<TKey, TValue> =
            Illuminate.CursorPaginator<TKey, TValue>;
        export type PaginatedDataCollection<TKey, TValue> =
            Illuminate.LengthAwarePaginator<TKey, TValue>;
    }
}
