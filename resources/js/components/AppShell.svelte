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

<div class="w-screen h-screen overflow-hidden {className}">
    {@render children?.()}
</div>
