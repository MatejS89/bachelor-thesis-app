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

<div class="flex min-h-dvh w-full lg:h-dvh lg:overflow-hidden {className}">
    {@render children?.()}
</div>
