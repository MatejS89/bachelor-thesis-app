import type { Feature } from 'geojson';
import { Beer, Coffee, IceCream, MapPin, Pizza, Utensils } from 'lucide-svelte';

export default function getIconForFeature(feature: Feature) {
    const props = feature?.properties || {};

    const amenity = props.amenity || props?.osm_data?.amenity || props.type;
    const cuisine = props.cuisine || props?.osm_data?.cuisine;

    switch (amenity) {
        case 'cafe':
            return Coffee;
        case 'bar':
        case 'pub':
        case 'biergarten':
            return Beer;
        case 'fast_food':
            if (cuisine && cuisine.includes('pizza')) {
                return Pizza;
            }

            return Utensils;
        case 'ice_cream':
            return IceCream;
        case 'restaurant':
        case 'food_court':
            return Utensils;
        default:
            return MapPin;
    }
}
