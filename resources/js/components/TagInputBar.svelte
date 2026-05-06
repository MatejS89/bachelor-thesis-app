<script lang="ts" module>
    export type AddOption = { value: string; label: string };
</script>

<script lang="ts">
    import { Plus } from 'lucide-svelte';
    import type { Snippet } from 'svelte';
    import { buttonVariants } from '@/components/ui/button';
    import * as Command from '@/components/ui/command';
    import * as Popover from '@/components/ui/popover';

    type Props = {
        options: AddOption[];
        onAdd: (value: string) => void;
        hasItems?: boolean;
        placeholder?: string;
        searchPlaceholder?: string;
        emptyText?: string;
        allowCustom?: boolean;
        formatCustom?: (raw: string) => { value: string; label: string };
        id?: string;
        children: Snippet;
    };

    let {
        options,
        onAdd,
        hasItems = false,
        placeholder = 'Add tag…',
        searchPlaceholder = 'Search…',
        emptyText = 'No matches.',
        allowCustom = false,
        formatCustom = (raw: string) => ({
            value: raw.trim(),
            label: raw.trim()
        }),
        id,
        children
    }: Props = $props();

    let open = $state(false);
    let search = $state('');

    function commit(value: string) {
        if (!value) {
            return;
        }

        onAdd(value);
        search = '';
        open = false;
    }

    function commitCustom() {
        if (!allowCustom || !search.trim()) {
            return;
        }

        commit(formatCustom(search).value);
    }

    function onInputKeydown(e: KeyboardEvent) {
        if (!allowCustom || !search.trim()) {
            return;
        }

        if (e.key === 'Enter') {
            const highlighted = (e.currentTarget as HTMLElement)
                ?.closest('[data-slot="command"]')
                ?.querySelector('[data-selected="true"]');

            if (!highlighted) {
                e.preventDefault();
                commitCustom();
            }
        } else if (e.key === ',') {
            e.preventDefault();
            commitCustom();
        }
    }

    let canOpen = $derived(allowCustom || options.length > 0);
</script>

<div
    class="flex min-h-9 flex-wrap items-center gap-1.5 rounded-md border bg-transparent p-1.5 dark:bg-input/30"
>
    {@render children()}

    <Popover.Root bind:open>
        <Popover.Trigger
            {id}
            class={buttonVariants({
                variant: 'ghost',
                size: 'sm',
                class: 'h-7 gap-1 px-2 text-muted-foreground',
            })}
            disabled={!canOpen}
        >
            <Plus class="h-3.5 w-3.5" />
            {hasItems ? 'Add' : placeholder}
        </Popover.Trigger>
        <Popover.Content class="w-72 p-0" align="start">
            <Command.Root>
                <Command.Input
                    placeholder={searchPlaceholder}
                    bind:value={search}
                    onkeydown={onInputKeydown}
                />
                <Command.List>
                    <Command.Empty>
                        {#if allowCustom && search.trim()}
                            <button
                                type="button"
                                class="flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-sm hover:bg-accent"
                                onclick={commitCustom}
                            >
                                <Plus class="h-4 w-4" />
                                Add "{formatCustom(search).label}"
                            </button>
                        {:else}
                            {emptyText}
                        {/if}
                    </Command.Empty>
                    {#if options.length}
                        <Command.Group
                            heading={allowCustom ? 'Suggestions' : undefined}
                        >
                            {#each options as option (option.value)}
                                <Command.Item
                                    value={option.label}
                                    onSelect={() => commit(option.value)}
                                >
                                    {option.label}
                                </Command.Item>
                            {/each}
                        </Command.Group>
                    {/if}
                </Command.List>
            </Command.Root>
        </Popover.Content>
    </Popover.Root>
</div>
