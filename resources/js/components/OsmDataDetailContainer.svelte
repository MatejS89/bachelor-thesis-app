<script lang="ts">
    import {
        Accessibility,
        Baby,
        Banknote,
        Beer,
        Building,
        Calendar,
        CheckCircle2,
        ChefHat,
        Cigarette,
        Clock,
        Coffee,
        CreditCard,
        Dog,
        Globe,
        Hash,
        HelpCircle,
        Info,
        Mail,
        Music,
        Phone,
        Pizza,
        Sandwich,
        ShoppingBag,
        Sparkles,
        Star,
        Store,
        Toilet,
        Truck,
        Utensils,
        UtensilsCrossed,
        Wifi,
        Wind,
        XCircle
    } from 'lucide-svelte';
    import OpeningBadge from '@/components/OpeningBadge.svelte';
    import { Badge } from '@/components/ui/badge/index.js';
    import * as Card from '@/components/ui/card/index';
    import {
        osmDietTags,
        osmFoodOptionTags,
        osmServiceTags
    } from '@/lib/osm-tags';

    let { restaurantData }: { restaurantData: App.Data.OsmData.OsmFeatureData } =
        $props();

    type TagValue = string | undefined;

    type DetailItem = {
        key: string;
        label: string;
        icon: any;
        value?: string;
        note?: string;
    };

    type DogPolicy = {
        label: string;
        allowed: boolean | 'partial' | null;
    };

    const positiveValues = ['yes', 'only', 'customers', 'wlan', 'free'];
    const negativeValues = ['no', 'none'];

    const dayMap: Record<string, string> = {
        Mo: 'Mon',
        Tu: 'Tue',
        We: 'Wed',
        Th: 'Thu',
        Fr: 'Fri',
        Sa: 'Sat',
        Su: 'Sun',
        PH: 'Holidays'
    };

    const tags = $derived(restaurantData.tags ?? {});

    function humanize(value: string): string {
        return value
            .replace(/_/g, ' ')
            .replace(/-/g, ' ')
            .replace(/\b\w/g, (letter) => letter.toUpperCase());
    }

    function formatTagValue(value: TagValue): string {
        if (!value) {
            return '';
        }

        const normalizedValue = value.trim().toLowerCase();

        if (normalizedValue === 'yes') {
            return 'Available';
        }

        if (normalizedValue === 'no') {
            return 'Not available';
        }

        if (normalizedValue === 'only') {
            return 'Only option';
        }

        if (normalizedValue === 'customers') {
            return 'For customers';
        }

        if (normalizedValue === 'limited') {
            return 'Limited';
        }

        if (normalizedValue === 'designated') {
            return 'Designated';
        }

        return humanize(value);
    }

    function splitTags(value: TagValue): string[] {
        return (
            value
                ?.split(';')
                .map((tag) => tag.trim())
                .filter(Boolean) ?? []
        );
    }

    function normalizeUrl(value: string): string {
        return /^https?:\/\//i.test(value) ? value : `https://${value}`;
    }

    function boolState(value: TagValue): boolean | 'partial' | null {
        if (!value) {
            return null;
        }

        const normalizedValue = value.trim().toLowerCase();

        if (positiveValues.includes(normalizedValue)) {
            return true;
        }

        if (negativeValues.includes(normalizedValue)) {
            return false;
        }

        if (
            ['limited', 'partial', 'permissive', 'conditional'].includes(
                normalizedValue
            )
        ) {
            return 'partial';
        }

        return null;
    }

    function boolIcon(value: TagValue) {
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

    function formatPaymentMethod(key: string, value: string): DetailItem {
        const rawName = key.replace('payment:', '');

        return {
            key,
            label: humanize(rawName),
            icon: rawName.includes('cash') ? Banknote : CreditCard,
            value:
                value === 'yes'
                    ? 'Accepted'
                    : value === 'no'
                        ? 'Not accepted'
                        : formatTagValue(value)
        };
    }

    function getAmenityIcon(type: TagValue) {
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

    function parseHours(raw: string) {
        return raw
            .split(';')
            .map((rule) => rule.trim())
            .filter(Boolean)
            .map((rule) => {
                const formattedRule = Object.entries(dayMap).reduce(
                    (formatted, [abbr, full]) =>
                        formatted.replace(
                            new RegExp(`\\b${abbr}\\b`, 'g'),
                            full
                        ),
                    rule
                );
                const isOff = formattedRule.includes('off');
                const firstDigitIdx = formattedRule.search(/\d/);
                const days = isOff
                    ? formattedRule
                        .replace(/\boff\b/g, '')
                        .trim()
                        .replace(/[:,\s]+$/, '')
                    : firstDigitIdx !== -1
                        ? formattedRule
                            .substring(0, firstDigitIdx)
                            .trim()
                            .replace(/[:,\s]+$/, '')
                        : formattedRule;
                const times = isOff
                    ? 'Closed'
                    : firstDigitIdx !== -1
                        ? formattedRule.substring(firstDigitIdx).trim()
                        : '';

                return { days, times, isOff };
            });
    }

    const parseDogPolicy = (dogTag?: string): DogPolicy => {
        if (!dogTag) {
            return { label: 'Unknown', allowed: null };
        }

        const normalizedValue = dogTag.trim().toLowerCase();

        switch (normalizedValue) {
            case 'yes':
                return { label: 'Allowed', allowed: true };
            case 'no':
                return { label: 'Not allowed', allowed: false };
            case 'leashed':
                return { label: 'Allowed on leash', allowed: 'partial' };
            case 'service':
                return { label: 'Service dogs only', allowed: 'partial' };
            case 'tethered':
                return { label: 'Allowed when tethered', allowed: 'partial' };
            default:
                return { label: formatTagValue(dogTag), allowed: null };
        }
    };

    const cuisines = $derived(splitTags(tags.cuisine));
    const amenityType = $derived(restaurantData.type ?? tags.amenity);
    const AmenityIcon = $derived(getAmenityIcon(amenityType));
    const serviceIcons: Record<string, any> = {
        takeaway: ShoppingBag,
        delivery: Truck,
        drive_through: Truck,
        reservation: Calendar,
        self_service: UtensilsCrossed
    };

    const dietItems = $derived(
        osmDietTags.filter((item) => tags[item.key] !== undefined)
    );

    const serviceItems: DetailItem[] = $derived(
        osmServiceTags
            .filter((item) => tags[item.key] !== undefined)
            .map((item) => ({
                key: item.key,
                label: item.label,
                icon: serviceIcons[item.key] ?? ShoppingBag,
                value: formatTagValue(tags[item.key])
            }))
    );

    const foodOptionItems = $derived(
        osmFoodOptionTags.filter((item) => tags[item.key] !== undefined)
    );

    const facilityItems: DetailItem[] = $derived(
        [
            {
                key: 'wheelchair',
                label: 'Wheelchair access',
                icon: Accessibility,
                value: formatTagValue(tags.wheelchair),
                note: tags['wheelchair:description']
            },
            {
                key: 'toilets',
                label: 'Toilets',
                icon: Toilet,
                value: formatTagValue(tags.toilets)
            },
            {
                key: 'toilets:wheelchair',
                label: 'Accessible toilet',
                icon: Accessibility,
                value: formatTagValue(tags['toilets:wheelchair'])
            },
            {
                key: 'outdoor_seating',
                label: 'Outdoor seating',
                icon: Sparkles,
                value: formatTagValue(tags.outdoor_seating),
                note: tags['capacity:outdoor']
                    ? `${tags['capacity:outdoor']} seats`
                    : undefined
            },
            {
                key: 'indoor_seating',
                label: 'Indoor seating',
                icon: Building,
                value: formatTagValue(tags.indoor_seating),
                note: tags.capacity
                    ? `${tags.capacity} total seats`
                    : undefined
            },
            {
                key: 'internet_access',
                label: 'Wi-Fi',
                icon: Wifi,
                value:
                    tags.internet_access === 'wlan'
                        ? 'Available'
                        : formatTagValue(tags.internet_access),
                note: tags['internet_access:ssid']
                    ? `SSID: ${tags['internet_access:ssid']}`
                    : tags['internet_access:fee'] === 'no'
                        ? 'Free'
                        : tags['internet_access:fee']
            },
            {
                key: 'air_conditioning',
                label: 'Air conditioning',
                icon: Wind,
                value: formatTagValue(tags.air_conditioning)
            },
            {
                key: 'high_chair',
                label: 'High chairs',
                icon: Baby,
                value: formatTagValue(tags.high_chair)
            },
            {
                key: 'changing_table',
                label: 'Changing table',
                icon: Baby,
                value: formatTagValue(tags.changing_table)
            },
            {
                key: 'dog',
                label: 'Dogs',
                icon: Dog,
                value: parseDogPolicy(tags.dog).label
            }
        ].filter((item) => tags[item.key] !== undefined)
    );

    const atmosphereItems: DetailItem[] = $derived(
        [
            {
                key: 'smoking',
                label: 'Smoking',
                icon: Cigarette,
                value: formatTagValue(tags.smoking)
            },
            {
                key: 'smoking:outside',
                label: 'Smoking outside',
                icon: Cigarette,
                value: formatTagValue(tags['smoking:outside'])
            },
            {
                key: 'bar',
                label: 'Bar',
                icon: Beer,
                value: formatTagValue(tags.bar)
            },
            {
                key: 'alcohol',
                label: 'Alcohol',
                icon: Beer,
                value: formatTagValue(tags.alcohol)
            },
            {
                key: 'cocktails',
                label: 'Cocktails',
                icon: Beer,
                value: formatTagValue(tags.cocktails)
            },
            {
                key: 'brewery',
                label: 'Brewery',
                icon: Beer,
                value: humanize(tags.brewery ?? '')
            },
            {
                key: 'microbrewery',
                label: 'Microbrewery',
                icon: Beer,
                value: formatTagValue(tags.microbrewery)
            },
            {
                key: 'live_music',
                label: 'Live music',
                icon: Music,
                value: formatTagValue(tags.live_music)
            },
            {
                key: 'tv',
                label: 'TV',
                icon: Music,
                value: formatTagValue(tags.tv)
            }
        ].filter((item) => tags[item.key] !== undefined)
    );

    const paymentMethods: DetailItem[] = $derived(
        Object.entries(tags)
            .filter(([key]) => key.startsWith('payment:'))
            .map(([key, value]) => formatPaymentMethod(key, value))
    );

    const contactItems = $derived(
        [
            {
                key: 'phone',
                label: 'Phone',
                icon: Phone,
                value: tags.phone ?? tags['contact:phone'],
                href: tags.phone
                    ? `tel:${tags.phone}`
                    : tags['contact:phone']
                        ? `tel:${tags['contact:phone']}`
                        : undefined
            },
            {
                key: 'mobile',
                label: 'Mobile',
                icon: Phone,
                value: tags['contact:mobile'],
                href: tags['contact:mobile']
                    ? `tel:${tags['contact:mobile']}`
                    : undefined
            },
            {
                key: 'email',
                label: 'Email',
                icon: Mail,
                value: tags.email ?? tags['contact:email'],
                href: tags.email
                    ? `mailto:${tags.email}`
                    : tags['contact:email']
                        ? `mailto:${tags['contact:email']}`
                        : undefined
            },
            {
                key: 'website',
                label: 'Website',
                icon: Globe,
                value: tags.website ?? tags['contact:website'],
                href:
                    tags.website || tags['contact:website']
                        ? normalizeUrl(tags.website ?? tags['contact:website'])
                        : undefined
            },
            {
                key: 'facebook',
                label: 'Facebook',
                icon: Globe,
                value: tags.facebook ?? tags['contact:facebook'],
                href:
                    tags.facebook || tags['contact:facebook']
                        ? normalizeUrl(
                            tags.facebook ?? tags['contact:facebook']
                        )
                        : undefined
            },
            {
                key: 'instagram',
                label: 'Instagram',
                icon: Globe,
                value: tags.instagram ?? tags['contact:instagram'],
                href:
                    tags.instagram || tags['contact:instagram']
                        ? normalizeUrl(
                            tags.instagram ?? tags['contact:instagram']
                        )
                        : undefined
            }
        ].filter((item) => item.value)
    );

    const identityItems = $derived(
        [
            { label: 'Brand', value: tags.brand },
            { label: 'Branch', value: tags.branch },
            { label: 'Operator', value: tags.operator },
            {
                label: 'Floor',
                value: tags.level ? `Level ${tags.level}` : null
            },
            { label: 'Started', value: tags.start_date }
        ].filter((item) => item.value)
    );

    const noteItems = $derived(
        [
            tags['description:en'] ?? tags.description,
            tags.note,
            tags.fixme
        ].filter(Boolean)
    );

    const formattedHours = $derived(
        tags.opening_hours ? parseHours(tags.opening_hours) : []
    );

    const breakfastHours = $derived(
        tags.breakfast && tags.breakfast.includes(':')
            ? parseHours(tags.breakfast)
            : []
    );

    const happyHours = $derived(
        tags.happy_hours && tags.happy_hours.includes(':')
            ? parseHours(tags.happy_hours)
            : []
    );

    const rawTagEntries = $derived(Object.entries(tags));
</script>

{#snippet sectionHeading(icon: any, label: string)}
    {@const Icon = icon}
    <h2
        class="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-muted-foreground"
    >
        <Icon class="h-3.5 w-3.5" />
        {label}
    </h2>
{/snippet}

{#snippet statusIcon(value: TagValue)}
    {@const state = boolIcon(value)}
    {@const Icon = state.icon}
    <Icon class={`h-4 w-4 shrink-0 ${state.className}`} />
{/snippet}

{#snippet detailRow(item: DetailItem)}
    {@const Icon = item.icon}
    <div
        class="flex items-start gap-3 rounded-md border border-border/60 bg-muted/25 p-3 min-w-0"
    >
        <Icon class="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
        <div class="min-w-0 flex-1">
            <div class="flex items-start justify-between gap-3 min-w-0">
                <p class="text-sm font-medium text-foreground">{item.label}</p>
                {#if item.value}
                    <p class="text-sm text-muted-foreground text-right break-words min-w-0">
                        {item.value}
                    </p>
                {/if}
            </div>
            {#if item.note}
                <p class="mt-1 text-xs text-muted-foreground">{item.note}</p>
            {/if}
        </div>
    </div>
{/snippet}

{#snippet hoursList(hours: ReturnType<typeof parseHours>)}
    <div class="space-y-1.5 rounded-md bg-muted/30 p-3">
        {#each hours as { days, times, isOff } (days + times)}
            <div class="flex justify-between gap-4 text-sm">
                <span class="font-medium text-foreground">{days}</span>
                <span
                    class={isOff
                        ? 'text-destructive'
                        : 'text-muted-foreground text-right'}
                >
                    {times}
                </span>
            </div>
        {/each}
    </div>
{/snippet}

<Card.Root class="shrink-0 overflow-hidden">
    <Card.Content class="grid gap-5">
        {#if amenityType || cuisines.length > 0 || tags.stars || tags.michelin_guide}
            <section class="grid gap-3">
                {@render sectionHeading(UtensilsCrossed, 'Details')}

                <div class="flex flex-row flex-wrap gap-1.5">
                    {#if amenityType}
                        <Badge variant="outline" class="gap-1 capitalize">
                            <AmenityIcon class="h-3 w-3" />
                            {humanize(amenityType)}
                        </Badge>
                    {/if}

                    {#each cuisines as cuisine (cuisine)}
                        <Badge variant="secondary" class="capitalize">
                            {humanize(cuisine)}
                        </Badge>
                    {/each}

                    {#if tags.stars}
                        <Badge variant="outline" class="gap-1">
                            <Star class="h-3 w-3 fill-amber-400 text-amber-400" />
                            {tags.stars} stars
                        </Badge>
                    {/if}

                    {#if tags.michelin_guide}
                        <Badge
                            variant="outline"
                            class="border-red-500/40 text-red-700 dark:text-red-300"
                        >
                            Michelin {formatTagValue(tags.michelin_guide)}
                        </Badge>
                    {/if}
                </div>
            </section>
        {/if}

        <section class="grid gap-3">
            <div class="flex flex-wrap items-center justify-between gap-2">
                {@render sectionHeading(Clock, 'Hours')}
                <OpeningBadge hoursString={tags.opening_hours} />
            </div>

            {#if formattedHours.length > 0}
                {@render hoursList(formattedHours)}
            {:else}
                <p class="text-sm text-muted-foreground">Hours not available</p>
            {/if}

            {#if breakfastHours.length > 0 || happyHours.length > 0}
                <div class="grid gap-3 sm:grid-cols-2">
                    {#if breakfastHours.length > 0}
                        <div class="grid gap-2">
                            <p
                                class="text-xs font-medium text-muted-foreground"
                            >
                                Breakfast
                            </p>
                            {@render hoursList(breakfastHours)}
                        </div>
                    {/if}

                    {#if happyHours.length > 0}
                        <div class="grid gap-2">
                            <p
                                class="text-xs font-medium text-muted-foreground"
                            >
                                Happy hours
                            </p>
                            {@render hoursList(happyHours)}
                        </div>
                    {/if}
                </div>
            {/if}
        </section>

        {#if dietItems.length > 0}
            <section class="grid gap-3">
                {@render sectionHeading(UtensilsCrossed, 'Dietary')}

                <div class="grid gap-2 sm:grid-cols-2">
                    {#each dietItems as item (item.key)}
                        <div
                            class="flex items-center gap-2 rounded-md border border-border/60 bg-muted/25 p-3 text-sm"
                        >
                            {@render statusIcon(tags[item.key])}
                            <span class="font-medium">{item.label}</span>
                            <span class="ml-auto text-muted-foreground">
                                {formatTagValue(tags[item.key])}
                            </span>
                        </div>
                    {/each}
                </div>
            </section>
        {/if}

        {#if contactItems.length > 0}
            <section class="grid gap-3">
                {@render sectionHeading(Phone, 'Contact')}

                <div class="grid gap-2 sm:grid-cols-2">
                    {#each contactItems as item (item.key)}
                        {@const Icon = item.icon}
                        <div
                            class="flex items-start gap-3 rounded-md border border-border/60 bg-muted/25 p-3 min-w-0"
                        >
                            <Icon
                                class="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground"
                            />
                            <div class="min-w-0">
                                <p class="text-xs text-muted-foreground">
                                    {item.label}
                                </p>
                                <a
                                    href={item.href}
                                    target={item.href?.startsWith('http')
                                        ? '_blank'
                                        : undefined}
                                    rel={item.href?.startsWith('http')
                                        ? 'noopener noreferrer'
                                        : undefined}
                                    class="block truncate text-sm font-medium text-primary underline-offset-4 hover:underline"
                                >
                                    {item.value}
                                </a>
                            </div>
                        </div>
                    {/each}
                </div>
            </section>
        {/if}

        {#if identityItems.length > 0 || tags['addr:full']}
            <section class="grid gap-3">
                {@render sectionHeading(Info, 'Identity')}

                <div class="grid gap-2 sm:grid-cols-2">
                    {#each identityItems as item (item.label)}
                        <div
                            class="flex items-start justify-between gap-3 rounded-md border border-border/60 bg-muted/25 p-3 min-w-0"
                        >
                            <p class="text-sm text-muted-foreground shrink-0">
                                {item.label}
                            </p>
                            <p
                                class="text-right text-sm font-medium text-foreground break-words min-w-0"
                            >
                                {item.value}
                            </p>
                        </div>
                    {/each}

                    {#if tags['addr:full']}
                        <div
                            class="rounded-md border border-border/60 bg-muted/25 p-3 sm:col-span-2 min-w-0"
                        >
                            <p class="text-sm text-muted-foreground">Address</p>
                            <p class="text-sm font-medium text-foreground break-words">
                                {tags['addr:full']}
                            </p>
                        </div>
                    {/if}
                </div>
            </section>
        {/if}

        {#if foodOptionItems.length > 0}
            <section class="grid gap-3">
                {@render sectionHeading(UtensilsCrossed, 'Food options')}
                <div class="flex flex-wrap gap-2">
                    {#each foodOptionItems as item (item.key)}
                        <Badge variant="outline">
                            {item.label}: {formatTagValue(tags[item.key])}
                        </Badge>
                    {/each}
                </div>
            </section>
        {/if}

        {#if serviceItems.length > 0}
            <section class="grid gap-3">
                {@render sectionHeading(ShoppingBag, 'Service')}

                <div class="grid gap-2 sm:grid-cols-2">
                    {#each serviceItems as item (item.key)}
                        {@render detailRow(item)}
                    {/each}
                </div>
            </section>
        {/if}

        {#if facilityItems.length > 0}
            <section class="grid gap-3">
                {@render sectionHeading(Accessibility, 'Facilities')}

                <div class="grid gap-2 sm:grid-cols-2">
                    {#each facilityItems as item (item.key)}
                        {@render detailRow(item)}
                    {/each}
                </div>
            </section>
        {/if}

        {#if atmosphereItems.length > 0}
            <section class="grid gap-3">
                {@render sectionHeading(Music, 'Atmosphere')}

                <div class="grid gap-2 sm:grid-cols-2">
                    {#each atmosphereItems as item (item.key)}
                        {@render detailRow(item)}
                    {/each}
                </div>
            </section>
        {/if}

        {#if paymentMethods.length > 0}
            <section class="grid gap-3">
                {@render sectionHeading(CreditCard, 'Payment')}

                <div class="grid gap-2 sm:grid-cols-2">
                    {#each paymentMethods as method (method.key)}
                        {@const Icon = method.icon}
                        <div
                            class="flex items-center gap-2 rounded-md border border-border/60 bg-muted/25 p-3 text-sm"
                        >
                            {@render statusIcon(tags[method.key])}
                            <Icon
                                class="h-4 w-4 shrink-0 text-muted-foreground"
                            />
                            <span class="font-medium">{method.label}</span>
                            <span
                                class={method.value === 'Not accepted'
                                    ? 'ml-auto text-destructive'
                                    : 'ml-auto text-muted-foreground'}
                            >
                                {method.value}
                            </span>
                        </div>
                    {/each}
                </div>
            </section>
        {/if}

        {#if noteItems.length > 0}
            <section class="grid gap-3">
                {@render sectionHeading(Info, 'Notes')}

                <div class="grid gap-2">
                    {#each noteItems as note (note)}
                        <p
                            class="rounded-md border border-border/60 bg-muted/25 p-3 text-sm text-muted-foreground"
                        >
                            {note}
                        </p>
                    {/each}
                </div>
            </section>
        {/if}
    </Card.Content>

    <Card.Footer class="border-t">
        <details class="group w-full">
            <summary
                class="flex cursor-pointer list-none items-center gap-1.5 text-xs font-semibold uppercase tracking-widest text-muted-foreground transition-colors hover:text-foreground"
            >
                <Hash class="h-3.5 w-3.5" />
                All OSM Tags ({rawTagEntries.length})

                <span
                    class="ml-auto text-xs font-normal normal-case group-open:hidden"
                >
                    Show
                </span>
                <span
                    class="ml-auto hidden text-xs font-normal normal-case group-open:inline"
                >
                    Hide
                </span>
            </summary>

            <div class="pt-3 font-mono text-xs">
                {#each rawTagEntries as [key, value] (key)}
                    <div
                        class="grid grid-cols-[minmax(8rem,12rem)_1fr] gap-3 border-b border-border/30 py-1 last:border-0"
                    >
                        <span class="truncate text-muted-foreground">{key}</span
                        >
                        <span class="break-all text-foreground">{value}</span>
                    </div>
                {/each}
            </div>
        </details>
    </Card.Footer>
</Card.Root>
