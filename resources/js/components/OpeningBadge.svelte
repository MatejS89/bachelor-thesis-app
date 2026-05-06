<script lang="ts">
    import opening_hours from 'opening_hours';
    import { Badge } from '@/components/ui/badge';

    let {
        hoursString,
        countryCode = 'cz'
    }: { hoursString: string | undefined; countryCode?: string } = $props();

    let status = $state<'open' | 'closed' | 'unknown' | 'error'>('unknown');

    let timeDetail = $state<string>('');

    $effect(() => {
        if (!hoursString) {
            status = 'unknown';

            return;
        }

        try {
            const nominatimObj = {
                address: {
                    country_code: countryCode.toLowerCase(),
                    state: ''
                }
            };

            const oh = new opening_hours(hoursString, nominatimObj);

            const isOpen = oh.getState();
            status = isOpen ? 'open' : 'closed';

            const nextChange: Date | undefined = oh.getNextChange();

            if (nextChange) {
                const timeString = nextChange.toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit'
                });

                const isToday =
                    nextChange.toDateString() === new Date().toDateString();
                const dayString = isToday
                    ? ''
                    : ` ${nextChange.toLocaleDateString([], { weekday: 'short' })}`;

                if (isOpen) {
                    timeDetail = `until ${timeString}${dayString}`;
                } else {
                    timeDetail = `Opens ${timeString}${dayString}`;
                }
            } else {
                timeDetail = isOpen ? '24/7' : '';
            }
        } catch (error) {
            // console.warn(
            //     `failed to parse ${hoursString}`,
            //     error,
            // );
            status = 'error';
        }
    });
</script>

{#if status === 'open'}
    <Badge class="bg-green-600 hover:bg-green-700 text-white font-medium">
        Open {timeDetail}
    </Badge>
{:else if status === 'closed'}
    <Badge variant="destructive" class="font-medium">
        Closed
        {#if timeDetail}
            <span class="ml-1 opacity-80 font-normal"> • {timeDetail}</span>
        {/if}
    </Badge>
{:else if status === 'error'}
    <Badge
        variant="outline"
        class="text-muted-foreground border-dashed"
        title={hoursString}
    >
        Hours format invalid
    </Badge>
{:else}
    <Badge variant="secondary" class="text-muted-foreground">
        Hours unknown
    </Badge>
{/if}
