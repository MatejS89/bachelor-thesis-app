import {
    Trees,
    Accessibility,
    Baby,
    Banknote,
    Beer,
    Building,
    Calendar,
    CheckCircle2,
    ChefHat,
    Cigarette,
    Coffee,
    CreditCard,
    Dog,
    Globe,
    HelpCircle,
    Info,
    Mail,
    Music,
    Phone,
    Pizza,
    Sandwich,
    ShoppingBag,
    Store,
    Toilet,
    Truck,
    Utensils,
    UtensilsCrossed,
    Wifi,
    Wind,
    XCircle,
} from 'lucide-svelte';
import {
    osmAtmosphereTags,
    osmContactSingletonTags,
    osmContactTags,
    osmDietTags,
    osmFacilityTags,
    osmFoodOptionTags,
    osmIdentityTags,
    osmPaymentTags,
    osmServiceTags,
} from '@/lib/osm-tags';

export type TagValue = string | undefined;
export type IconComponent = any;

export type DetailItem = {
    key: string;
    label: string;
    icon: IconComponent;
    value?: string;
    note?: string;
};

export type StatusItem = {
    key: string;
    label: string;
    icon?: IconComponent;
    value: string;
    statusValue: TagValue;
};

export type BadgeItem = {
    key: string;
    label: string;
};

export type ContactItem = {
    key: string;
    label: string;
    icon: IconComponent;
    value: string;
    href: string;
};

export type IdentityItem = {
    label: string;
    value: string;
};

export type HoursEntry = { days: string; times: string; isOff: boolean };

type ParsedTags = App.Data.OsmData.ParsedOsmTagsData;

const POSITIVE = ['yes', 'only', 'customers', 'wlan', 'free'];
const NEGATIVE = ['no', 'none'];
const PARTIAL = ['limited', 'partial', 'permissive', 'conditional'];

const DAY_MAP: Record<string, string> = {
    Mo: 'Mon',
    Tu: 'Tue',
    We: 'Wed',
    Th: 'Thu',
    Fr: 'Fri',
    Sa: 'Sat',
    Su: 'Sun',
    PH: 'Holidays',
};

const VALUE_LABELS: Record<string, string> = {
    yes: 'Available',
    no: 'Not available',
    only: 'Only option',
    customers: 'For customers',
    limited: 'Limited',
    designated: 'Designated',
};

export function humanize(value: string): string {
    return value
        .replace(/_/g, ' ')
        .replace(/-/g, ' ')
        .replace(/\b\w/g, (l) => l.toUpperCase());
}

export function formatTagValue(value: TagValue): string {
    if (!value) {
        return '';
    }

    const normalized = value.trim().toLowerCase();

    return VALUE_LABELS[normalized] ?? humanize(value);
}

export function boolState(value: TagValue): boolean | 'partial' | null {
    if (!value) {
        return null;
    }

    const normalized = value.trim().toLowerCase();

    if (POSITIVE.includes(normalized)) {
        return true;
    }

    if (NEGATIVE.includes(normalized)) {
        return false;
    }

    if (PARTIAL.includes(normalized)) {
        return 'partial';
    }

    return null;
}

export function boolIcon(value: TagValue): {
    icon: IconComponent;
    className: string;
} {
    const state = boolState(value);

    if (state === true) {
        return { icon: CheckCircle2, className: 'text-green-600' };
    }

    if (state === false) {
        return { icon: XCircle, className: 'text-muted-foreground/40' };
    }

    if (state === 'partial') {
        return { icon: HelpCircle, className: 'text-amber-600' };
    }

    return { icon: Info, className: 'text-muted-foreground' };
}

export function normalizeUrl(value: string): string {
    return /^https?:\/\//i.test(value) ? value : `https://${value}`;
}

export function parseHours(raw: string): HoursEntry[] {
    return raw
        .split(';')
        .map((rule) => rule.trim())
        .filter(Boolean)
        .map((rule) => {
            const formatted = Object.entries(DAY_MAP).reduce(
                (acc, [abbr, full]) =>
                    acc.replace(new RegExp(`\\b${abbr}\\b`, 'g'), full),
                rule,
            );
            const isOff = formatted.includes('off');
            const firstDigit = formatted.search(/\d/);
            const days = isOff
                ? formatted
                      .replace(/\boff\b/g, '')
                      .trim()
                      .replace(/[:,\s]+$/, '')
                : firstDigit !== -1
                  ? formatted
                        .substring(0, firstDigit)
                        .trim()
                        .replace(/[:,\s]+$/, '')
                  : formatted;
            const times = isOff
                ? 'Closed'
                : firstDigit !== -1
                  ? formatted.substring(firstDigit).trim()
                  : '';

            return { days, times, isOff };
        });
}

export function parseDogPolicy(value: TagValue): string {
    if (!value) {
        return '';
    }

    const map: Record<string, string> = {
        yes: 'Allowed',
        no: 'Not allowed',
        leashed: 'Allowed on leash',
        service: 'Service dogs only',
        tethered: 'Allowed when tethered',
    };

    return map[value.trim().toLowerCase()] ?? formatTagValue(value);
}

export function getAmenityIcon(type: TagValue): IconComponent {
    switch (type?.trim().toLowerCase()) {
        case 'restaurant':
            return ChefHat;
        case 'cafe':
            return Coffee;
        case 'fast_food':
            return Sandwich;
        case 'food_court':
            return Store;
        case 'bar':
        case 'biergarten':
        case 'pub':
            return Beer;
        case 'pizza':
            return Pizza;
        default:
            return Utensils;
    }
}

const SERVICE_ICONS: Record<string, IconComponent> = {
    takeaway: ShoppingBag,
    delivery: Truck,
    drive_through: Truck,
    reservation: Calendar,
    self_service: UtensilsCrossed,
};

const FACILITY_ICONS: Record<string, IconComponent> = {
    wheelchair: Accessibility,
    toilets: Toilet,
    'toilets:wheelchair': Accessibility,
    outdoor_seating: Trees,
    indoor_seating: Building,
    internet_access: Wifi,
    air_conditioning: Wind,
    high_chair: Baby,
    changing_table: Baby,
    dog: Dog,
};

const ATMOSPHERE_ICONS: Record<string, IconComponent> = {
    smoking: Cigarette,
    'smoking:outside': Cigarette,
    bar: Beer,
    alcohol: Beer,
    cocktails: Beer,
    brewery: Beer,
    microbrewery: Beer,
    live_music: Music,
    tv: Music,
};

export function buildDietItems(tags: ParsedTags): StatusItem[] {
    return osmDietTags
        .filter((def) => tags.diet[def.key] !== undefined)
        .map((def) => ({
            key: def.key,
            label: def.label,
            statusValue: tags.diet[def.key],
            value: formatTagValue(tags.diet[def.key]),
        }));
}

export function buildPaymentItems(tags: ParsedTags): StatusItem[] {
    return osmPaymentTags
        .filter((def) => tags.payment[def.key] !== undefined)
        .map((def) => ({
            key: def.key,
            label: def.label,
            icon: def.key === 'cash' ? Banknote : CreditCard,
            statusValue: tags.payment[def.key],
            value:
                tags.payment[def.key] === 'yes'
                    ? 'Accepted'
                    : tags.payment[def.key] === 'no'
                      ? 'Not accepted'
                      : formatTagValue(tags.payment[def.key]),
        }));
}

export function buildServiceItems(tags: ParsedTags): DetailItem[] {
    return osmServiceTags
        .filter((def) => tags.other[def.key] !== undefined)
        .map((def) => ({
            key: def.key,
            label: def.label,
            icon: SERVICE_ICONS[def.key] ?? ShoppingBag,
            value: formatTagValue(tags.other[def.key]),
        }));
}

const FACILITY_SKIP = new Set([
    'wheelchair:description',
    'capacity:outdoor',
    'capacity',
    'internet_access:ssid',
    'internet_access:fee',
]);

export function buildFacilityItems(tags: ParsedTags): DetailItem[] {
    const other = tags.other;

    return osmFacilityTags
        .filter(
            (def) =>
                other[def.key] !== undefined && !FACILITY_SKIP.has(def.key),
        )
        .map((def) => {
            let value = formatTagValue(other[def.key]);
            let note: string | undefined;

            switch (def.key) {
                case 'wheelchair':
                    note = other['wheelchair:description'];
                    break;
                case 'outdoor_seating':
                    if (other['capacity:outdoor']) {
                        note = `${other['capacity:outdoor']} seats`;
                    }

                    break;
                case 'indoor_seating':
                    if (other.capacity) {
                        note = `${other.capacity} total seats`;
                    }

                    break;
                case 'internet_access':
                    if (other.internet_access === 'wlan') {
                        value = 'Available';
                    }

                    note = other['internet_access:ssid']
                        ? `SSID: ${other['internet_access:ssid']}`
                        : other['internet_access:fee'] === 'no'
                          ? 'Free'
                          : other['internet_access:fee'];
                    break;
                case 'dog':
                    value = parseDogPolicy(other.dog);
                    break;
            }

            return {
                key: def.key,
                label: def.label,
                icon: FACILITY_ICONS[def.key] ?? Info,
                value,
                note,
            };
        });
}

export function buildAtmosphereItems(tags: ParsedTags): DetailItem[] {
    return osmAtmosphereTags
        .filter((def) => tags.other[def.key] !== undefined)
        .map((def) => ({
            key: def.key,
            label: def.label,
            icon: ATMOSPHERE_ICONS[def.key] ?? Music,
            value:
                def.key === 'brewery'
                    ? humanize(tags.other.brewery ?? '')
                    : formatTagValue(tags.other[def.key]),
        }));
}

export function buildFoodOptionItems(tags: ParsedTags): BadgeItem[] {
    return osmFoodOptionTags
        .filter((def) => tags.other[def.key] !== undefined)
        .map((def) => ({
            key: def.key,
            label: `${def.label}: ${formatTagValue(tags.other[def.key])}`,
        }));
}

export function buildContactItems(tags: ParsedTags): ContactItem[] {
    const singletons = osmContactSingletonTags
        .filter((def) => tags.other[def.key])
        .map<ContactItem>((def) => {
            const value = tags.other[def.key];
            const href =
                def.key === 'phone'
                    ? `tel:${value}`
                    : def.key === 'email'
                      ? `mailto:${value}`
                      : normalizeUrl(value);

            return {
                key: def.key,
                label: def.label,
                icon:
                    def.key === 'phone'
                        ? Phone
                        : def.key === 'email'
                          ? Mail
                          : Globe,
                value,
                href,
            };
        });

    const social = osmContactTags
        .filter((def) => tags.contact[def.key])
        .map<ContactItem>((def) => ({
            key: `contact:${def.key}`,
            label: def.label,
            icon: Globe,
            value: tags.contact[def.key],
            href: normalizeUrl(tags.contact[def.key]),
        }));

    return [...singletons, ...social];
}

export function buildIdentityItems(tags: ParsedTags): IdentityItem[] {
    return osmIdentityTags
        .map((def) => ({
            label: def.label,
            value:
                def.key === 'level' && tags.other.level
                    ? `Level ${tags.other.level}`
                    : (tags.other[def.key] ?? ''),
        }))
        .filter((item) => item.value);
}

export function buildNoteItems(tags: ParsedTags): string[] {
    return [
        tags.other['description:en'] ?? tags.other.description,
        tags.other.note,
        tags.other.fixme,
    ].filter((s): s is string => Boolean(s));
}

export function buildRawTagEntries(
    tags: ParsedTags,
): Array<readonly [string, string]> {
    return [
        ...(tags.opening_hours
            ? [['opening_hours', tags.opening_hours] as const]
            : []),
        ...(tags.cuisine.length > 0
            ? [['cuisine', tags.cuisine.join(';')] as const]
            : []),
        ...Object.entries(tags.diet).map(([k, v]) => [`diet:${k}`, v] as const),
        ...Object.entries(tags.payment).map(
            ([k, v]) => [`payment:${k}`, v] as const,
        ),
        ...Object.entries(tags.contact).map(
            ([k, v]) => [`contact:${k}`, v] as const,
        ),
        ...Object.entries(tags.address).map(
            ([k, v]) => [`addr:${k}`, v] as const,
        ),
        ...Object.entries(tags.other),
    ];
}
