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

<main
    class='mx-auto flex h-full w-full flex-col flex-1 {className}'>
    {@render children?.()}
</main>
