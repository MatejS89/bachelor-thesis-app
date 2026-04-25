<script lang="ts">
    import { Hash } from 'lucide-svelte';
    import * as Card from '@/components/ui/card/index';

    let { restaurantData }: { restaurantData: App.Data.OsmFeatureData } = $props();

    const getPaymentMethods = (tags: Record<string, string>) => {
        return Object.entries(tags)
            .filter(([key]) => key.startsWith('payment:'))
            .map(([key, value]) => {
                const rawName = key.replace('payment:', '').replace(/_/g, ' ');
                const label = rawName.charAt(0).toUpperCase() + rawName.slice(1);

                let formattedValue = value;

                if (value === 'yes') {
                    formattedValue = 'Accepted';
                } else if (value === 'no') {
                    formattedValue = 'Not accepted';
                }

                return { label, value: formattedValue };
            });
    };

    type DogPolicy = {
        label: string;
        allowed: boolean | 'partial' | null;
        iconUrl: string | null;
    };

    const ICONS = {
        ALLOWED: 'https://upload.wikimedia.org/wikipedia/commons/2/23/Pictogram_Dog.svg',
        BANNED: 'https://upload.wikimedia.org/wikipedia/commons/5/52/No_dogs.svg',
        LEASHED: 'https://upload.wikimedia.org/wikipedia/commons/4/4b/Dogs_on_leash_pictogram.svg',
        UNKNOWN: null
    };

    export const parseDogPolicy = (dogTag?: string): DogPolicy => {
        if (!dogTag) {
            return { label: 'Unknown', allowed: null, iconUrl: ICONS.UNKNOWN };
        }

        const normalizedValue = dogTag.trim().toLowerCase();

        switch (normalizedValue) {
            case 'yes':
                return { label: 'Allowed', allowed: true, iconUrl: ICONS.ALLOWED };
            case 'no':
                return { label: 'Not allowed', allowed: false, iconUrl: ICONS.BANNED };
            case 'leashed':
            case 'service':
            case 'tethered':
                return { label: 'Allowed (Conditionally)', allowed: 'partial', iconUrl: ICONS.LEASHED };
            default:
                return {
                    label: dogTag.charAt(0).toUpperCase() + dogTag.slice(1),
                    allowed: null,
                    iconUrl: ICONS.UNKNOWN
                };
        }
    };


    let isOpenNow = $derived.by(() => {
        const rawHours = restaurantData?.tags?.opening_hours;

        if (!rawHours) {
            return null;
        }

        try {
            const oh = new opening_hours(rawHours);

            return oh.getState();
        } catch (e) {
            console.warn('Invalid opening hours format:', e);

            return null;
        }
    });

    let formattedHours = $derived.by(() => {
        const rawHours = restaurantData?.tags?.opening_hours;

        if (!rawHours) {
            return [];
        }

        const rules = rawHours.split(';').map(r => r.trim()).filter(Boolean);
        const dayMap: Record<string, string> = {
            'Mo': 'Mon', 'Tu': 'Tue', 'We': 'Wed',
            'Th': 'Thu', 'Fr': 'Fri', 'Sa': 'Sat',
            'Su': 'Sun', 'PH': 'Holidays'
        };

        return rules.map(rule => {
            let formattedRule = rule;
            Object.entries(dayMap).forEach(([abbr, full]) => {
                const regex = new RegExp(`\\b${abbr}\\b`, 'g');
                formattedRule = formattedRule.replace(regex, full);
            });

            let days = formattedRule;
            let times = '';

            if (formattedRule.includes('off')) {
                days = formattedRule.replace(/\boff\b/g, '').trim();
                times = 'Closed';
            } else {
                const firstDigitIdx = formattedRule.search(/\d/);

                if (firstDigitIdx !== -1) {
                    days = formattedRule.substring(0, firstDigitIdx).trim();
                    times = formattedRule.substring(firstDigitIdx).trim();
                }
            }

            return {
                days: days.replace(/[:,\s]+$/, ''),
                times
            };
        });
    });

    const rawTagEntries = $derived(Object.entries(restaurantData.tags));
    const paymentMethods = getPaymentMethods(restaurantData.tags);
    const dogPolicy: DogPolicy = parseDogPolicy(restaurantData.tags['dog']);
</script>

<Card.Root class="shrink-0">
    <Card.Content>
        <dl class="text-muted-foreground flex flex-col gap-3">
            <div class="flex flex-col sm:flex-row sm:justify-between sm:gap-4 ">
                <dt class="font-medium text-foreground shrink-0">Opening hours</dt>
                {#if formattedHours.length > 0}
                    <div class="space-y-2 bg-muted/30 p-3 rounded-md">
                        {#each formattedHours as { days, times }}
                            <div
                                class="flex items-start justify-between text-sm border-b border-border/40 pb-2 last:border-0 last:pb-0 gap-4">
                                <span class="font-medium text-foreground">{days}</span>
                                <span class="text-muted-foreground text-right">{times}</span>
                            </div>
                        {/each}
                    </div>
                {:else}
                    <p class="text-sm text-muted-foreground">Hours not available</p>
                {/if}
            </div>

            <dt class="font-medium text-foreground">Contacts</dt>
            <dd>
                <dl class="grid gap-3">
                    {#if restaurantData.tags.phone}
                        <div class="flex flex-col sm:flex-row sm:justify-between sm:gap-4">
                            <dt class="text-muted-foreground shrink-0">Phone</dt>
                            <dd class="text-foreground sm:text-right">
                                <a
                                    href={`tel:${restaurantData.tags.phone}`}
                                    class="text-primary underline-offset-4 hover:underline">
                                    {restaurantData.tags.phone}
                                </a>
                            </dd>
                        </div>
                    {/if}

                    {#if restaurantData.tags.website}
                        <div class="flex flex-col sm:flex-row sm:justify-between sm:gap-4">
                            <dt class="text-muted-foreground shrink-0">Website:</dt>
                            <dd class="sm:text-right overflow-hidden text-ellipsis whitespace-nowrap">
                                <a
                                    href={restaurantData.tags.website}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    class="text-primary underline-offset-4 hover:underline"
                                >
                                    {restaurantData.tags.website}
                                </a>
                            </dd>
                        </div>
                    {/if}

                    {#if restaurantData.tags.email}
                        <div class="flex flex-col sm:flex-row sm:justify-between sm:gap-4">
                            <dt class="text-muted-foreground shrink-0">Email:</dt>
                            <dd class="sm:text-right overflow-hidden text-ellipsis whitespace-nowrap">
                                <a
                                    href={`mailto:${restaurantData.tags.email}`}
                                    class="text-primary underline-offset-4 hover:underline">
                                    {restaurantData.tags.email}
                                </a>
                            </dd>
                        </div>
                    {/if}

                    {#if restaurantData.tags.facebook}
                        <div class="flex flex-col sm:flex-row sm:justify-between sm:gap-4">
                            <dt class="text-muted-foreground shrink-0">Email:</dt>
                            <dd class="sm:text-right overflow-hidden text-ellipsis whitespace-nowrap">
                                <a
                                    href={restaurantData.tags.facebook}
                                    class="text-primary underline-offset-4 hover:underline">
                                    Facebook
                                </a>
                            </dd>
                        </div>
                    {/if}
                </dl>
            </dd>

            <dt class="font-medium text-foreground">Dietary</dt>
            <dd>
                <dl class="grid gap-3">
                    {#if restaurantData.tags.cuisine}
                        <div class="flex flex-col sm:flex-row sm:justify-between sm:gap-4">
                            <dt class="text-muted-foreground shrink-0">Cuisine:</dt>

                            <dd class="sm:text-right overflow-hidden text-ellipsis whitespace-nowrap">
                                <ul>
                                    {#each restaurantData.tags.cuisine.split(';') as cuisine, i(cuisine + i)}
                                        <li>{cuisine}</li>
                                    {/each}
                                </ul>
                            </dd>
                        </div>
                    {/if}
                </dl>
            </dd>

            <dt class="font-semibold text-foreground">Features & accessibility</dt>
            <dd>
                <ul class="flex flex-wrap gap-2 text-xs text-muted-foreground">
                    {#if restaurantData.tags.takeaway === 'yes'}
                        <li class="bg-muted px-2 py-1 rounded-md">Takeaway</li>
                    {/if}
                    {#if restaurantData.tags.delivery === 'yes'}
                        <li class="bg-muted px-2 py-1 rounded-md">Delivery</li>
                    {/if}
                    {#if restaurantData.tags.outdoor_seating === 'yes'}
                        <li class="bg-muted px-2 py-1 rounded-md">Outdoor Seating</li>
                    {/if}
                    {#if restaurantData.tags.wheelchair === 'yes'}
                        <li class="bg-muted px-2 py-1 rounded-md">Wheelchair Accessible</li>
                    {/if}
                </ul>
            </dd>

            {#if paymentMethods.length > 0}
                <dt class="font-semibold text-foreground mb-1">Payment</dt>
                <dd>
                    <dl class="grid sm:grid-cols-[auto_1fr] gap-x-4 gap-y-1">
                        {#each paymentMethods as method, i(method.label + i)}
                            <dt class="text-muted-foreground">{method.label}</dt>
                            <dd class="text-foreground sm:text-right">
                    <span class={method.value === 'Not accepted' ? 'text-destructive' : ''}>
                        {method.value}
                    </span>
                            </dd>
                        {/each}
                    </dl>
                </dd>
            {/if}

            {#if restaurantData.tags.description}
                <dt class="font-semibold text-foreground mb-1">Notes</dt>
                <dd>{restaurantData.tags.description}</dd>
            {/if}

            {#if dogPolicy.allowed !== null}
                <dt class="font-semibold text-foreground mb-1 mt-4 border-t pt-4">Pets</dt>
                <dd>
                    <dl class="grid sm:grid-cols-[auto_1fr] gap-x-4 gap-y-1 items-center">
                        <dt class="text-muted-foreground">Dogs</dt>

                        <dd class="text-foreground sm:text-right flex items-center justify-end gap-2">
                            {#if dogPolicy.iconUrl}
                                <img
                                    src={dogPolicy.iconUrl}
                                    alt={dogPolicy.label}
                                    class="w-5 h-5 object-contain"
                                    aria-hidden="true"
                                />
                            {/if}

                            <span class={
                    dogPolicy.allowed === false ? 'text-destructive' :
                    dogPolicy.allowed === true ? 'text-green-600 dark:text-green-400' :
                    'text-amber-600 dark:text-amber-400'
                }>
                    {dogPolicy.label}
                </span>
                        </dd>
                    </dl>
                </dd>
            {/if}
        </dl>
    </Card.Content>

    <Card.Footer>
        <details class="group w-full">
            <summary
                class=" text-xs font-semibold uppercase tracking-widest text-muted-foreground cursor-pointer select-none flex items-center gap-1.5 hover:text-foreground transition-colors list-none">
                <Hash class="h-3.5 w-3.5" />
                All OSM Tags ({rawTagEntries.length})
                <span class="ml-auto text-xs normal-case font-normal group-open:hidden">Show</span>
                <span class="ml-auto text-xs normal-case font-normal hidden group-open:inline">Hide</span>
            </summary>

            <div class="pt-3 space-y-0.5 font-mono text-xs">
                {#each rawTagEntries as [k, v] (k)}
                    <div class="flex justify-between py-1 border-b border-border/30 last:border-0">
                        <span class="text-muted-foreground shrink-0 w-48 truncate">{k}</span>
                        <span class="text-foreground break-all">{v}</span>
                    </div>
                {/each}
            </div>
        </details>
    </Card.Footer>
</Card.Root>
