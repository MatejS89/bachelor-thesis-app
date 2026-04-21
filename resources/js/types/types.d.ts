declare namespace App {
    namespace Data {
        export type AllergenData = {
            id: number;
            name: string;
        };
        export type BoundingBox = {
            readonly north: number;
            readonly south: number;
            readonly east: number;
            readonly west: number;
        };
        export type DietaryTagData = {
            id: number;
            name: string;
        };
        export type GalleryImageData = {
            id: number;
            url: string;
            thumb_url: string;
            order: number;
        };
        export type MenuItemData = {
            id: number;
            name: string;
            description: string;
            createdAt: string;
            allergens?: App.Data.AllergenData[];
            dietaryTags?: App.Data.DietaryTagData[];
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
        export type OsmFeatureData = {
            id: number;
            osm_type: string;
            osm_id: number;
            name: string;
            type: string | null;
            tags: Array<any>;
            geom: { type: 'Point'; coordinates: [number, number] };
        };
        export type OsmGeoJSONCollectionData = {
            type: 'FeatureCollection';
            features: unknown[];
        };
        export type ReviewData = {
            id: number;
            description: string | null;
            rating: number;
            created_at: string;
            user?: App.Data.User.UserMinData;
            photo_urls: Array<any>;
        };
        namespace User {
            export type UserData = {
                id: number;
                name: string;
                email: string;
                reviews?: App.Data.ReviewData[];
            };
            export type UserMinData = {
                name: string;
            };
        }
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
