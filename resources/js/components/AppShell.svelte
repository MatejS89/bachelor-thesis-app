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

<div class="flex min-h-dvh h-full lg:h-svh w-full lg:overflow-hidden {className}">
    {@render children?.()}
</div>
