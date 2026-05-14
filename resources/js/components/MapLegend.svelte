<script lang="ts">
    import * as Card from '@/components/ui/card/index';
    import { COLOR_CONFIG } from '@/lib/get_color';

    const highPct = COLOR_CONFIG.thresholds.high * 100;
    const medPct = COLOR_CONFIG.thresholds.medium * 100;

    let { class: className = '' } = $props();

    const legendItems = [
        {
            label: `≥ ${highPct}% Safe`,
            color: COLOR_CONFIG.mapColors.green,
        },
        {
            label: `${medPct}% - ${highPct - 1}% Safe`,
            color: COLOR_CONFIG.mapColors.orange,
        },
        {
            label: `< ${medPct}% Safe`,
            color: COLOR_CONFIG.mapColors.red,
        },
        {
            label: 'No Data',
            color: COLOR_CONFIG.mapColors.neutral,
        },
    ];
</script>

<Card.Root class="z-100 w-max shadow-lg {className} p-2 border-primary border-2 bg-[color-mix(in_oklch,var(--color-accent)_60%,white)]
           dark:bg-accent">
    <Card.Content class="flex flex-col gap-1.5 p-0 text-accent-foreground text-sm lg:text-base">
        <span class="wrap-break-word ">% of menu items without selected allergens</span>
        {#each legendItems as item (item.label)}
            <div class="flex items-center gap-2">
                <span
                    class="w-3.5 h-3.5 shrink-0 rounded-full border shadow-sm"
                    style="background-color: {item.color};"
                ></span>
                <span class="leading-none">
                    {item.label}
                </span>
            </div>
        {/each}
    </Card.Content>
</Card.Root>
