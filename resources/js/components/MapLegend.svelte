<script lang="ts">
    import * as Card from '@/components/ui/card/index';
    import { RATIO_CONFIG } from '@/utils/get_color';

    const highPct = RATIO_CONFIG.thresholds.high * 100;
    const medPct = RATIO_CONFIG.thresholds.medium * 100;

    let { class: className = '' } = $props();

    const legendItems = [
        {
            label: `≥ ${highPct}% Safe`,
            color: RATIO_CONFIG.mapColors.green
        },
        {
            label: `${medPct}% - ${highPct - 1}% Safe`,
            color: RATIO_CONFIG.mapColors.orange
        },
        {
            label: `< ${medPct}% Safe`,
            color: RATIO_CONFIG.mapColors.red
        },
        {
            label: 'No Data',
            color: RATIO_CONFIG.mapColors.neutral
        }
    ];
</script>

<Card.Root class="z-100 w-max shadow-lg bg-card/95 {className} p-2">
    <Card.Content class="flex flex-col gap-1.5 p-0">
        {#each legendItems as item (item.label)}
            <div class="flex items-center gap-2">
                <span
                    class="w-2.5 h-2.5 shrink-0 rounded-full border border-black/10 shadow-sm"
                    style="background-color: {item.color};"
                ></span>
                <span class="text-xs font-medium text-foreground leading-none">
                    {item.label}
                </span>
            </div>
        {/each}

    </Card.Content>
</Card.Root>
