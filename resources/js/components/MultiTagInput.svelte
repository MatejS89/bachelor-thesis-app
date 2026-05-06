<script lang="ts">
    import { X } from 'lucide-svelte';
    import TagInputBar from '@/components/TagInputBar.svelte';
    import { Badge } from '@/components/ui/badge';
    import { Button } from '@/components/ui/button';

    type Props = {
        id: string;
        value: string | string[];
        suggestions?: readonly string[];
        separator?: string;
        placeholder?: string;
        searchPlaceholder?: string;
        emptyText?: string;
        allowCustom?: boolean;
        formatLabel?: (value: string) => string;
        formatValue?: (input: string) => string;
    };

    let {
        id = '',
        value = $bindable([]),
        suggestions = [],
        separator = ';',
        placeholder = 'Add tag…',
        searchPlaceholder = 'Search…',
        emptyText = 'No matches.',
        allowCustom = true,
        formatLabel = (v: string) =>
            v
                .replace(/_/g, ' ')
                .replace(/-/g, ' ')
                .replace(/\b\w/g, (l) => l.toUpperCase()),
        formatValue = (v: string) =>
            v.trim().toLowerCase().replace(/\s+/g, '_')
    }: Props = $props();

    let tags = $derived(
        Array.isArray(value)
            ? value
            : value
                ? value
                    .split(separator)
                    .map((t) => t.trim())
                    .filter(Boolean)
                : []
    );

    let options = $derived(
        suggestions
            .filter((s) => !tags.includes(s))
            .map((s) => ({ value: s, label: formatLabel(s) }))
    );

    function addTag(raw: string) {
        const tag = formatValue(raw);

        if (!tag || tags.includes(tag)) {
            return;
        }

        const newTags = [...tags, tag];
        value = Array.isArray(value) ? newTags : newTags.join(separator);
    }

    function removeTag(tag: string) {
        const newTags = tags.filter((t) => t !== tag);
        value = Array.isArray(value) ? newTags : newTags.join(separator);
    }
</script>

<TagInputBar
    {id}
    {options}
    onAdd={addTag}
    hasItems={tags.length > 0}
    {placeholder}
    {searchPlaceholder}
    {emptyText}
    {allowCustom}
    formatCustom={(raw) => {
        const v = formatValue(raw);

        return { value: v, label: formatLabel(v) };
    }}
>
    {#each tags as tag (tag)}
        <Badge variant="secondary" class="gap-1 text-xs sm:text-sm">
            <span>{formatLabel(tag)}</span>
            <Button
                type="button"
                variant="ghost"
                size="icon"
                class="h-4 w-4 rounded-full p-0 hover:bg-background"
                onclick={() => removeTag(tag)}
                aria-label={`Remove ${formatLabel(tag)}`}
            >
                <X class="h-3 w-3" />
            </Button>
        </Badge>
    {/each}
</TagInputBar>
