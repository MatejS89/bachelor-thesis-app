<script lang="ts">
    import { ChevronDown, X } from 'lucide-svelte';
    import TagInputBar from '@/components/TagInputBar.svelte';
    import { Badge } from '@/components/ui/badge';
    import { Button } from '@/components/ui/button';
    import * as Command from '@/components/ui/command';
    import * as Popover from '@/components/ui/popover';
    import { cn } from '@/lib/utils';

    type KeyDef = { key: string; label: string };

    type Props = {
        id?: string;
        value: Record<string, string>;
        keys: readonly KeyDef[];
        valueOptions: readonly string[];
        defaultValue?: string;
        placeholder?: string;
        searchPlaceholder?: string;
        valueSearchPlaceholder?: string;
        emptyText?: string;
        formatValue?: (v: string) => string;
    };

    let {
        id = '',
        value = $bindable(),
        keys,
        valueOptions,
        defaultValue = 'yes',
        placeholder = 'Add tag…',
        searchPlaceholder = 'Search…',
        valueSearchPlaceholder = 'Set value…',
        emptyText = 'No matches.',
        formatValue = (v: string) =>
            !v
                ? 'Unknown'
                : v
                    .replace(/_/g, ' ')
                    .replace(/-/g, ' ')
                    .replace(/\b\w/g, (l) => l.toUpperCase())
    }: Props = $props();

    let selectedKeys = $derived(keys.filter((k) => k.key in value));
    let options = $derived(
        keys
            .filter((k) => !(k.key in value))
            .map((k) => ({ value: k.key, label: k.label }))
    );

    let valueOpenKey = $state<string | null>(null);

    function addKey(k: string) {
        value[k] = defaultValue;
    }

    function removeKey(k: string) {
        delete value[k];
    }

    function setValue(k: string, v: string) {
        value[k] = v;
        valueOpenKey = null;
    }
</script>

<TagInputBar
    {id}
    {options}
    onAdd={addKey}
    hasItems={selectedKeys.length > 0}
    {placeholder}
    {searchPlaceholder}
    {emptyText}
>
    {#each selectedKeys as keyDef (keyDef.key)}
        <Badge variant="default" class="gap-1 text-xs sm:text-sm pr-1">
            <Popover.Root
                open={valueOpenKey === keyDef.key}
                onOpenChange={(o) =>
                    (valueOpenKey = o ? keyDef.key : null)}
            >
                <Popover.Trigger
                    class="flex cursor-pointer items-center gap-1 rounded hover:opacity-80"
                >
                    <span>{keyDef.label}:</span>
                    <span class="font-medium">
                        {formatValue(value[keyDef.key])}
                    </span>
                    <ChevronDown class="h-3 w-3 opacity-60" />
                </Popover.Trigger>
                <Popover.Content class="w-56 p-0" align="start">
                    <Command.Root>
                        <Command.Input
                            placeholder={valueSearchPlaceholder}
                        />
                        <Command.List>
                            <Command.Empty>{emptyText}</Command.Empty>
                            <Command.Group>
                                {#each valueOptions as option (option)}
                                    <Command.Item
                                        value={formatValue(option)}
                                        onSelect={() =>
                                            setValue(keyDef.key, option)}
                                    >
                                        <span
                                            class={cn(
                                                'mr-2 inline-block h-1.5 w-1.5 rounded-full',
                                                value[keyDef.key] === option
                                                    ? 'bg-primary'
                                                    : 'bg-transparent',
                                            )}
                                        ></span>
                                        {formatValue(option)}
                                    </Command.Item>
                                {/each}
                            </Command.Group>
                        </Command.List>
                    </Command.Root>
                </Popover.Content>
            </Popover.Root>

            <Button
                type="button"
                variant="ghost"
                size="icon"
                class="h-4 w-4 rounded-full p-0 hover:bg-background"
                onclick={() => removeKey(keyDef.key)}
                aria-label={`Remove ${keyDef.label}`}
            >
                <X class="h-3 w-3" />
            </Button>
        </Badge>
    {/each}
</TagInputBar>
