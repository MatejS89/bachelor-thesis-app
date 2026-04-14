<script lang="ts">
    import type { Snippet } from 'svelte';

    let {
        class: className = '',
        children
    }: {
        class?: string;
        children?: Snippet;
    } = $props();
</script>

<div class="h-dvh w-dvw overflow-hidden {className}">
    {@render children?.()}
</div>
