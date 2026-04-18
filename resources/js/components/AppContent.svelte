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
    class='mx-auto flex h-full w-full flex-col flex-1 min-h-0 min-w-0 {className} pb-[env(safe-area-inset-bottom)]'>
    {@render children?.()}
</main>
