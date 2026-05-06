<script lang="ts">
    import { Check, ChevronsUpDown } from 'lucide-svelte';
    import { buttonVariants } from '@/components/ui/button';
    import * as Command from '@/components/ui/command';
    import * as Popover from '@/components/ui/popover';
    import { cn } from '@/lib/utils';

    type Props = {
        value: string;
        options: readonly string[];
        placeholder?: string;
        searchPlaceholder?: string;
        emptyText?: string;
        emptyOptionLabel?: string;
        formatLabel?: (value: string) => string;
        id?: string;
    };

    let {
        value = $bindable(''),
        options,
        placeholder = 'Select…',
        searchPlaceholder = 'Search…',
        emptyText = 'No matches.',
        emptyOptionLabel,
        formatLabel = (v: string) =>
            v
                .replace(/_/g, ' ')
                .replace(/-/g, ' ')
                .replace(/\b\w/g, (l) => l.toUpperCase()),
        id
    }: Props = $props();

    let open = $state(false);

    let displayLabel = $derived(
        value === '' && emptyOptionLabel !== undefined
            ? emptyOptionLabel
            : value
                ? formatLabel(value)
                : placeholder
    );
</script>

<Popover.Root bind:open>
    <Popover.Trigger
        {id}
        role="combobox"
        aria-expanded={open}
        class={buttonVariants({
            variant: 'outline',
            class: cn(
                'h-8 w-full justify-between font-normal',
                !value && 'text-muted-foreground',
            ),
        })}
    >
        <span class="truncate">{displayLabel}</span>
        <ChevronsUpDown class="ml-2 h-4 w-4 shrink-0 opacity-50" />
    </Popover.Trigger>
    <Popover.Content
        class="w-[--bits-popover-anchor-width] p-0"
        align="start"
    >
        <Command.Root>
            <Command.Input placeholder={searchPlaceholder} />
            <Command.List>
                <Command.Empty>{emptyText}</Command.Empty>
                <Command.Group>
                    {#if emptyOptionLabel !== undefined}
                        <Command.Item
                            value={emptyOptionLabel}
                            onSelect={() => {
                                value = '';
                                open = false;
                            }}
                        >
                            <Check
                                class={cn(
                                    'mr-2 h-4 w-4',
                                    value === ''
                                        ? 'opacity-100'
                                        : 'opacity-0',
                                )}
                            />
                            {emptyOptionLabel}
                        </Command.Item>
                    {/if}
                    {#each options as option (option)}
                        <Command.Item
                            value={option}
                            onSelect={() => {
                                value = option;
                                open = false;
                            }}
                        >
                            <Check
                                class={cn(
                                    'mr-2 h-4 w-4',
                                    value === option
                                        ? 'opacity-100'
                                        : 'opacity-0',
                                )}
                            />
                            {formatLabel(option)}
                        </Command.Item>
                    {/each}
                </Command.Group>
            </Command.List>
        </Command.Root>
    </Popover.Content>
</Popover.Root>
