declare namespace App {
    namespace Data {
        export type EditPhotoItemData = {
            kind: string;
            id: number | null;
            file: File | null;
            url: string | null;
            thumb_url: string | null;
        };
        export type GalleryImageData = {
            id: number;
            url: string;
            thumb_url: string;
            order: number;
        };
        export type PhotoData = {
            id: string;
            url: string;
        };
        namespace Allergen {
            export type AllergenData = {
                id: number;
                name: string;
            };
        }
        namespace DietaryTag {
            export type DietaryTagData = {
                id: number;
                name: string;
            };
        }
        namespace MenuItem {
            export type MenuItemData = {
                id: number;
                name: string;
                description: string;
                createdAt: string;
                allergens?: App.Data.Allergen.AllergenData[];
                dietaryTags?: App.Data.DietaryTag.DietaryTagData[];
                photoUrl: string;
            };
        }
        namespace OsmData {
            export type FilterOsmDataData = {
                south: number | null;
                west: number | null;
                north: number | null;
                east: number | null;
                userLat: number | null;
                userLng: number | null;
                allergens: (string | number)[] | null;
            };
            export type OsmFeatureData = {
                id: number;
                osm_type: string;
                osm_id: number;
                name: string;
                type: string | null;
                tags: Record<string, any>;
                geom: { type: 'Point'; coordinates: [number, number] };
                average_rating: number | null;
                photos?: App.Data.PhotoData[];
            };
            export type OsmSearchResultData = {
                id: number;
                name: string;
                geom: { type: 'Point'; coordinates: [number, number] };
            };
            export type SearchOsmDataData = {
                search: string;
            };
            export type UpdateOsmDataData = {
                id: number;
                name: string;
                type: string | null;
                cuisine: Array<any>;
                diet: Array<any>;
                photos: App.Data.EditPhotoItemData[] | null;
                opening_hours: string | null;
            };
        }
        namespace Review {
            export type ReviewData = {
                id: number;
                description: string | null;
                rating: number;
                created_at: string;
                user?: App.Data.User.UserMinData;
                photos?: App.Data.PhotoData[];
            };
        }
        namespace User {
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
