<script lang="ts">
    import type { WithoutChildren } from 'bits-ui';
    import { getEmblaContext } from './context.js';
    import { cn } from '@/lib/utils.js';
    import { Button, type Props } from '@/components/ui/button/index.js';
    import ChevronLeftIcon from '@lucide/svelte/icons/chevron-left';

    let {
        ref = $bindable(null),
        class: className,
        variant = 'outline',
        size = 'icon-sm',
        ...restProps
    }: WithoutChildren<Props> = $props();

    const emblaCtx = getEmblaContext('<Carousel.Previous/>');
</script>

<Button
    data-slot="carousel-previous"
    {variant}
    {size}
    aria-disabled={!emblaCtx.canScrollPrev}
    disabled={!emblaCtx.canScrollPrev}
    class={cn(
		"rounded-full absolute touch-manipulation",
		emblaCtx.orientation === "horizontal"
			? "-inset-s-12 inset-y-0 my-auto"
			: "inset-s-1/2 inset-x-0 mx-auto rotate-90",
		className
	)}
    onclick={emblaCtx.scrollPrev}
    onkeydown={emblaCtx.handleKeyDown}
    {...restProps}
    bind:ref
>
    <ChevronLeftIcon />
    <span class="sr-only">Previous slide</span>
</Button>
