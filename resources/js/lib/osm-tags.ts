export type OsmTagDefinition = {
    key: string;
    label: string;
};

export type OsmTagFieldDefinition = OsmTagDefinition & {
    type?: 'text' | 'textarea' | 'select';
    options?: string[];
    placeholder?: string;
};

export const osmBooleanValues = ['', 'yes', 'no', 'limited', 'only'] as const;

export const osmAmenityTypes = [
    'restaurant',
    'cafe',
    'fast_food',
    'food_court',
    'pub',
    'bar',
    'biergarten',
] as const;

export const osmCuisineValues = [
    'american',
    'asian',
    'barbecue',
    'breakfast',
    'burger',
    'cake',
    'chicken',
    'chinese',
    'coffee_shop',
    'crepe',
    'donut',
    'fine_dining',
    'fish_and_chips',
    'french',
    'german',
    'greek',
    'ice_cream',
    'indian',
    'international',
    'italian',
    'japanese',
    'kebab',
    'korean',
    'lebanese',
    'mediterranean',
    'mexican',
    'noodle',
    'pasta',
    'pizza',
    'ramen',
    'regional',
    'sandwich',
    'seafood',
    'spanish',
    'steak_house',
    'sushi',
    'thai',
    'turkish',
    'vegan',
    'vegetarian',
    'vietnamese',
] as const;

export const osmDietTags: OsmTagDefinition[] = [
    { key: 'diet:vegetarian', label: 'Vegetarian' },
    { key: 'diet:vegan', label: 'Vegan' },
    { key: 'diet:gluten_free', label: 'Gluten-free' },
    { key: 'diet:lactose_free', label: 'Lactose-free' },
    { key: 'diet:dairy_free', label: 'Dairy-free' },
    { key: 'diet:egg_free', label: 'Egg-free' },
    { key: 'diet:sugar_free', label: 'Sugar-free' },
    { key: 'diet:halal', label: 'Halal' },
    { key: 'diet:kosher', label: 'Kosher' },
    { key: 'diet:pescetarian', label: 'Pescetarian' },
    { key: 'diet:raw', label: 'Raw' },
    { key: 'diet:meat', label: 'Meat' },
    { key: 'diet:non-vegetarian', label: 'Non-vegetarian' },
];

export const osmServiceTags: OsmTagFieldDefinition[] = [
    {
        key: 'takeaway',
        label: 'Takeaway',
        type: 'select',
        options: [...osmBooleanValues],
    },
    {
        key: 'delivery',
        label: 'Delivery',
        type: 'select',
        options: [...osmBooleanValues],
    },
    {
        key: 'drive_through',
        label: 'Drive-through',
        type: 'select',
        options: [...osmBooleanValues],
    },
    {
        key: 'reservation',
        label: 'Reservations',
        type: 'select',
        options: [...osmBooleanValues],
    },
    {
        key: 'self_service',
        label: 'Self service',
        type: 'select',
        options: [...osmBooleanValues],
    },
];

export const osmFacilityTags: OsmTagFieldDefinition[] = [
    {
        key: 'wheelchair',
        label: 'Wheelchair access',
        type: 'select',
        options: [...osmBooleanValues, 'designated'],
    },
    {
        key: 'wheelchair:description',
        label: 'Wheelchair description',
        type: 'textarea',
    },
    {
        key: 'toilets',
        label: 'Toilets',
        type: 'select',
        options: [...osmBooleanValues],
    },
    {
        key: 'toilets:wheelchair',
        label: 'Accessible toilet',
        type: 'select',
        options: [...osmBooleanValues],
    },
    {
        key: 'outdoor_seating',
        label: 'Outdoor seating',
        type: 'select',
        options: [...osmBooleanValues],
    },
    { key: 'capacity:outdoor', label: 'Outdoor seats' },
    {
        key: 'indoor_seating',
        label: 'Indoor seating',
        type: 'select',
        options: [...osmBooleanValues],
    },
    { key: 'capacity', label: 'Total seats' },
    {
        key: 'internet_access',
        label: 'Wi-Fi',
        type: 'select',
        options: ['', 'wlan', 'yes', 'no', 'customers'],
    },
    { key: 'internet_access:ssid', label: 'Wi-Fi SSID' },
    {
        key: 'internet_access:fee',
        label: 'Wi-Fi fee',
        type: 'select',
        options: ['', 'yes', 'no', 'customers'],
    },
    {
        key: 'air_conditioning',
        label: 'Air conditioning',
        type: 'select',
        options: [...osmBooleanValues],
    },
    {
        key: 'high_chair',
        label: 'High chairs',
        type: 'select',
        options: [...osmBooleanValues],
    },
    {
        key: 'changing_table',
        label: 'Changing table',
        type: 'select',
        options: [...osmBooleanValues],
    },
    {
        key: 'dog',
        label: 'Dogs',
        type: 'select',
        options: ['', 'yes', 'no', 'leashed', 'service', 'tethered'],
    },
];

export const osmAtmosphereTags: OsmTagFieldDefinition[] = [
    {
        key: 'smoking',
        label: 'Smoking',
        type: 'select',
        options: ['', 'yes', 'no', 'outside', 'separated', 'isolated'],
    },
    {
        key: 'smoking:outside',
        label: 'Smoking outside',
        type: 'select',
        options: [...osmBooleanValues],
    },
    {
        key: 'bar',
        label: 'Bar',
        type: 'select',
        options: [...osmBooleanValues],
    },
    {
        key: 'alcohol',
        label: 'Alcohol',
        type: 'select',
        options: ['', 'yes', 'no', 'beer', 'wine'],
    },
    {
        key: 'cocktails',
        label: 'Cocktails',
        type: 'select',
        options: [...osmBooleanValues],
    },
    { key: 'brewery', label: 'Brewery' },
    {
        key: 'microbrewery',
        label: 'Microbrewery',
        type: 'select',
        options: [...osmBooleanValues],
    },
    {
        key: 'live_music',
        label: 'Live music',
        type: 'select',
        options: [...osmBooleanValues],
    },
    { key: 'tv', label: 'TV', type: 'select', options: [...osmBooleanValues] },
];

export const osmFoodOptionTags: OsmTagFieldDefinition[] = [
    {
        key: 'organic',
        label: 'Organic',
        type: 'select',
        options: [...osmBooleanValues, 'only'],
    },
    {
        key: 'local_produce',
        label: 'Local produce',
        type: 'select',
        options: [...osmBooleanValues],
    },
    {
        key: 'fair_trade',
        label: 'Fair trade',
        type: 'select',
        options: [...osmBooleanValues],
    },
];

export const osmContactTags: OsmTagFieldDefinition[] = [
    { key: 'phone', label: 'Phone' },
    { key: 'email', label: 'Email' },
    { key: 'website', label: 'Website' },
    { key: 'contact:facebook', label: 'Facebook' },
    { key: 'contact:instagram', label: 'Instagram' },
];

export const osmIdentityTags: OsmTagFieldDefinition[] = [
    { key: 'brand', label: 'Brand' },
    { key: 'branch', label: 'Branch' },
    { key: 'operator', label: 'Operator' },
    { key: 'level', label: 'Floor / level' },
    { key: 'start_date', label: 'Started' },
    { key: 'addr:full', label: 'Address', type: 'textarea' },
];

export const osmPaymentTags: OsmTagFieldDefinition[] = [
    {
        key: 'payment:cash',
        label: 'Cash',
        type: 'select',
        options: ['', 'yes', 'no'],
    },
    {
        key: 'payment:cards',
        label: 'Cards',
        type: 'select',
        options: ['', 'yes', 'no'],
    },
    {
        key: 'payment:contactless',
        label: 'Contactless',
        type: 'select',
        options: ['', 'yes', 'no'],
    },
    {
        key: 'payment:visa',
        label: 'Visa',
        type: 'select',
        options: ['', 'yes', 'no'],
    },
    {
        key: 'payment:mastercard',
        label: 'Mastercard',
        type: 'select',
        options: ['', 'yes', 'no'],
    },
    {
        key: 'payment:amex',
        label: 'Amex',
        type: 'select',
        options: ['', 'yes', 'no'],
    },
];
