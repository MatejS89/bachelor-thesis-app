<script lang="ts">
    import { ExternalLink, Plus, X } from 'lucide-svelte';
    import opening_hours from 'opening_hours';
    import { SvelteDate } from 'svelte/reactivity';
    import { Badge } from '@/components/ui/badge';
    import { Button, buttonVariants } from '@/components/ui/button';
    import * as Card from '@/components/ui/card';
    import { Checkbox } from '@/components/ui/checkbox';
    import * as Dialog from '@/components/ui/dialog';
    import { Input } from '@/components/ui/input';
    import { Label } from '@/components/ui/label';
    import { Separator } from '@/components/ui/separator';
    import { Textarea } from '@/components/ui/textarea';

    let { value = $bindable('') }: { value: string } = $props();

    const DAYS = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'] as const;
    type Day = (typeof DAYS)[number];

    const DAY_LABELS: Record<Day, string> = {
        Mo: 'Monday',
        Tu: 'Tuesday',
        We: 'Wednesday',
        Th: 'Thursday',
        Fr: 'Friday',
        Sa: 'Saturday',
        Su: 'Sunday'
    };

    type Range = { from: string; to: string };
    type DayState = { closed: boolean; ranges: Range[] };

    function emptyState(): Record<Day, DayState> {
        return {
            Mo: { closed: true, ranges: [] },
            Tu: { closed: true, ranges: [] },
            We: { closed: true, ranges: [] },
            Th: { closed: true, ranges: [] },
            Fr: { closed: true, ranges: [] },
            Sa: { closed: true, ranges: [] },
            Su: { closed: true, ranges: [] }
        };
    }

    const REFERENCE_MONDAY = new Date(2024, 0, 8, 0, 0, 0, 0);

    function formatTime(date: Date, dayStart: Date): string {
        const dayMs = 24 * 60 * 60 * 1000;

        if (date.getTime() >= dayStart.getTime() + dayMs) {
            return '24:00';
        }

        const h = String(date.getHours()).padStart(2, '0');
        const m = String(date.getMinutes()).padStart(2, '0');

        return `${h}:${m}`;
    }

    function parse(input: string): {
        state: Record<Day, DayState>;
        error: string | null;
    } {
        const state = emptyState();
        const trimmed = (input ?? '').trim();

        if (!trimmed) {
            return { state, error: null };
        }

        let oh: opening_hours;

        try {
            oh = new opening_hours(trimmed);
        } catch (e) {
            return {
                state,
                error: e instanceof Error ? e.message : String(e)
            };
        }

        for (let i = 0; i < DAYS.length; i++) {
            const dayStart = new SvelteDate(REFERENCE_MONDAY);
            dayStart.setDate(REFERENCE_MONDAY.getDate() + i);
            const dayEnd = new SvelteDate(dayStart);
            dayEnd.setDate(dayStart.getDate() + 1);

            const intervals = oh.getOpenIntervals(dayStart, dayEnd);
            const day = DAYS[i];

            if (intervals.length === 0) {
                state[day] = { closed: true, ranges: [] };
            } else {
                state[day] = {
                    closed: false,
                    ranges: intervals.map(([from, to]) => ({
                        from: formatTime(from as Date, dayStart),
                        to: formatTime(to as Date, dayStart)
                    }))
                };
            }
        }

        return { state, error: null };
    }

    function schedulesEqual(a: DayState, b: DayState): boolean {
        if (a.closed !== b.closed) {
            return false;
        }

        if (a.ranges.length !== b.ranges.length) {
            return false;
        }

        return a.ranges.every(
            (r, i) =>
                r.from === b.ranges[i].from && r.to === b.ranges[i].to
        );
    }

    function serialize(state: Record<Day, DayState>): string {
        const all247 = DAYS.every((d) => {
            const s = state[d];

            return (
                !s.closed &&
                s.ranges.length === 1 &&
                s.ranges[0].from === '00:00' &&
                (s.ranges[0].to === '24:00' || s.ranges[0].to === '00:00')
            );
        });

        if (all247) {
            return '24/7';
        }

        const groups: { days: Day[]; state: DayState }[] = [];

        for (const d of DAYS) {
            const s = state[d];
            const last = groups[groups.length - 1];

            if (last && schedulesEqual(last.state, s)) {
                last.days.push(d);
            } else {
                groups.push({ days: [d], state: s });
            }
        }

        const parts: string[] = [];

        for (const g of groups) {
            if (g.state.closed || g.state.ranges.length === 0) {
                continue;
            }

            const incomplete = g.state.ranges.some((r) => !r.from || !r.to);

            if (incomplete) {
                continue;
            }

            const dayToken =
                g.days.length === 1
                    ? g.days[0]
                    : `${g.days[0]}-${g.days[g.days.length - 1]}`;
            const timesToken = g.state.ranges
                .map((r) => `${r.from}-${r.to}`)
                .join(',');

            parts.push(`${dayToken} ${timesToken}`);
        }

        return parts.join('; ');
    }

    function canEditStructured(input: string): boolean {
        const trimmed = (input ?? '').trim();

        if (!trimmed) {
            return true;
        }

        if (trimmed === '24/7') {
            return true;
        }

        const unsupported = [
            /\bPH\b/,
            /\bSH\b/,
            /\beaster\b/i,
            /\bweek\b/i,
            /\b(sunrise|sunset|dawn|dusk)\b/i,
            /\b(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)\b/i,
            /\b\d{4}\b/,
            /\[[^\]]+]/,
            /"/
        ];

        return !unsupported.some((re) => re.test(trimmed));
    }

    const initial = parse(value);
    let days = $state(initial.state);
    let parseError = $state(initial.error);
    let mode = $state<'structured' | 'raw'>(
        canEditStructured(value) ? 'structured' : 'raw'
    );

    $effect(() => {
        if (mode !== 'structured') {
            return;
        }

        const out = serialize(days);

        if (out !== value) {
            value = out;
            parseError = null;
        }
    });

    $effect(() => {
        if (mode !== 'raw') {
            return;
        }

        try {
            new opening_hours(value || '');
            parseError = null;
        } catch (e) {
            parseError = e instanceof Error ? e.message : String(e);
        }
    });

    let confirmOpen = $state(false);

    function applySwitchToStructured() {
        const reparsed = parse(value);
        days = reparsed.state;
        parseError = reparsed.error;
        mode = 'structured';
    }

    function switchToStructured() {
        if (!canEditStructured(value)) {
            confirmOpen = true;

            return;
        }

        applySwitchToStructured();
    }

    function confirmSwitch() {
        confirmOpen = false;
        applySwitchToStructured();
    }

    function switchToRaw() {
        mode = 'raw';
    }

    let prettified = $derived.by(() => {
        if (!value) {
            return '';
        }

        try {
            return new opening_hours(value).prettifyValue();
        } catch {
            return value;
        }
    });

    function addRange(day: Day) {
        days[day].closed = false;
        days[day].ranges.push({ from: '09:00', to: '17:00' });
    }

    function removeRange(day: Day, index: number) {
        days[day].ranges.splice(index, 1);

        if (days[day].ranges.length === 0) {
            days[day].closed = true;
        }
    }

    function toggleClosed(day: Day) {
        days[day].closed = !days[day].closed;

        if (!days[day].closed && days[day].ranges.length === 0) {
            days[day].ranges.push({ from: '09:00', to: '17:00' });
        }
    }

    function set247() {
        for (const d of DAYS) {
            days[d] = {
                closed: false,
                ranges: [{ from: '00:00', to: '24:00' }]
            };
        }
    }

    function clearAll() {
        for (const d of DAYS) {
            days[d] = { closed: true, ranges: [] };
        }
    }

    function copyMondayToWeek() {
        const mo = days.Mo;

        for (const d of DAYS) {
            days[d] = {
                closed: mo.closed,
                ranges: mo.ranges.map((r) => ({ ...r }))
            };
        }
    }

</script>

<div class="flex flex-col gap-4">
    <div class="flex flex-wrap items-center justify-between gap-2">
        {#if mode === 'structured'}
            <div class="flex flex-wrap items-center gap-2">
                <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onclick={set247}
                >
                    Open 24/7
                </Button>
                <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onclick={copyMondayToWeek}
                >
                    Copy Monday to all days
                </Button>
                <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onclick={clearAll}
                >
                    Clear
                </Button>
            </div>
            <Button
                type="button"
                variant="ghost"
                size="sm"
                onclick={switchToRaw}
            >
                Edit as text
            </Button>
        {:else}
            <div class="flex flex-wrap items-center gap-2">
                <a
                    href="https://wiki.openstreetmap.org/wiki/Key:opening_hours"
                    target="_blank"
                    rel="noopener noreferrer"
                    class={buttonVariants({
                        variant: 'link',
                        size: 'sm',
                        class: 'h-auto gap-1 px-0',
                    })}
                >
                    OSM opening_hours docs
                    <ExternalLink class="h-3.5 w-3.5" />
                </a>
            </div>
            <Button
                type="button"
                variant="ghost"
                size="sm"
                onclick={switchToStructured}
            >
                Edit by day
            </Button>
        {/if}
    </div>

    <Separator />

    {#if mode === 'raw'}
        <Textarea
            rows={3}
            class="font-mono"
            placeholder="e.g. PH,Mo-Su 14:00-23:00"
            bind:value
        />
    {:else}

        <div class="flex flex-col gap-2">
            {#each DAYS as day (day)}
                <Card.Root class="py-3">
                    <Card.Content
                        class="grid grid-cols-1 items-center gap-3 px-3 sm:grid-cols-[7rem_7rem_1fr]"
                    >
                        <Label class="text-sm font-medium">
                            {DAY_LABELS[day]}
                        </Label>

                        <Label class="flex items-center gap-2">
                            <Checkbox
                                checked={days[day].closed}
                                onCheckedChange={() => toggleClosed(day)}
                            />
                            <span class="text-sm">Closed</span>
                        </Label>

                        <div class="flex min-w-0 flex-col gap-2">
                            {#if !days[day].closed}
                                {#each days[day].ranges as range, i (i)}
                                    <div
                                        class="flex flex-1 flex-wrap items-center gap-2"
                                    >
                                        <Input
                                            type="time"
                                            class="h-8 w-28 shrink-0"
                                            bind:value={range.from}
                                        />
                                        <span
                                            class="text-sm text-muted-foreground"
                                        >–</span
                                        >
                                        <Input
                                            type="time"
                                            class="h-8 w-28 shrink-0"
                                            bind:value={range.to}
                                        />
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="icon"
                                            class="shrink-0"
                                            onclick={() => removeRange(day, i)}
                                        >
                                            <X class="h-4 w-4" />
                                        </Button>
                                    </div>
                                {/each}
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    class="self-start"
                                    onclick={() => addRange(day)}
                                >
                                    <Plus class="mr-1 h-4 w-4" />
                                    Add range
                                </Button>
                            {:else}
                            <span class="self-center text-sm text-muted-foreground">
                                Closed all day
                            </span>
                            {/if}
                        </div>
                    </Card.Content>
                </Card.Root>
            {/each}
        </div>
    {/if}

    <Separator />

    <div class="flex flex-col gap-1 text-xs text-muted-foreground">
        <div class="flex flex-wrap items-center gap-2">
            <span>OSM value:</span>
            <Badge
                variant="secondary"
                class="h-auto max-w-full whitespace-normal break-all py-0.5 text-left font-mono"
            >
                {value || '(empty)'}
            </Badge>
        </div>
        {#if prettified && prettified !== value}
            <div class="flex flex-wrap items-center gap-2">
                <span>Prettified:</span>
                <Badge
                    variant="outline"
                    class="h-auto max-w-full whitespace-normal break-all py-0.5 text-left font-mono"
                >
                    {prettified}
                </Badge>
            </div>
        {/if}
        {#if parseError}
            <div class="flex flex-wrap items-center gap-2">
                <Badge variant="destructive">Invalid</Badge>
                <span>{parseError}</span>
            </div>
        {/if}
    </div>
</div>

<Dialog.Root bind:open={confirmOpen}>
    <Dialog.Content>
        <Dialog.Header>
            <Dialog.Title>Switch to structured editor?</Dialog.Title>
            <Dialog.Description>
                The current value uses selectors that the structured editor
                cannot represent (e.g. <code>PH</code>, <code>SH</code>,
                specific dates). Switching will discard those parts on the
                next edit.
            </Dialog.Description>
        </Dialog.Header>
        <div class="flex flex-col gap-2 text-xs text-muted-foreground">
            <div>
                Current value:
                <Badge variant="secondary" class="ml-1 font-mono">
                    {value || '(empty)'}
                </Badge>
            </div>
            <a
                href="https://wiki.openstreetmap.org/wiki/Key:opening_hours"
                target="_blank"
                rel="noopener noreferrer"
                class={buttonVariants({
                    variant: 'link',
                    size: 'sm',
                    class: 'h-auto gap-1 self-start px-0',
                })}
            >
                Learn more about OSM opening_hours
                <ExternalLink class="h-3.5 w-3.5" />
            </a>
        </div>
        <Dialog.Footer>
            <Button
                type="button"
                variant="outline"
                onclick={() => (confirmOpen = false)}
            >
                Cancel
            </Button>

            <Button
                type="button"
                variant="destructive"
                onclick={confirmSwitch}
            >
                Switch and discard
            </Button>
        </Dialog.Footer>
    </Dialog.Content>
</Dialog.Root>
