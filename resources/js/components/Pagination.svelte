<script lang="ts">
    import { inertia } from '@inertiajs/svelte';
    import ChevronLeft from 'lucide-svelte/icons/chevron-left';
    import ChevronRight from 'lucide-svelte/icons/chevron-right';
    import MoreHorizontal from 'lucide-svelte/icons/more-horizontal';
    import { buttonVariants } from '@/components/ui/button';
    import { cn } from '@/lib/utils';

    interface PaginationProps {
        links: {
            url: string | null;
            label: string;
            active: boolean;
        }[];
        currentPage: number;
        className?: string;
    }

    let { links, currentPage, className }: PaginationProps = $props();

    let previousLink = $derived(links[0]);
    let nextLink = $derived(links[links.length - 1]);
    let pageLinks = $derived(links.slice(1, links.length - 1));
</script>


<nav class="mx-auto flex w-full justify-center {className}">
    {#key currentPage}
        <ul class="flex flex-row items-center gap-1">
            <li>
                <a
                    href={previousLink?.url ?? undefined}
                    use:inertia={{ preserveState: true}}
                    class={cn(
                    buttonVariants({ variant: 'ghost', size: 'default' }),
                    'gap-1 pl-2.5',
                    !previousLink?.url && 'pointer-events-none opacity-50'
                )}
                >
                    <ChevronLeft class="h-4 w-4" />
                    <span class="hidden sm:block">Previous</span>
                </a>
            </li>

            {#each pageLinks as link}
                <li>
                    {#if link.label === '...'}
                        <div class="flex h-9 w-9 items-center justify-center">
                            <MoreHorizontal class="h-4 w-4" />
                        </div>
                    {:else if link.active}
                    <span
                        class={cn(
                            buttonVariants({ variant: 'default', size: 'icon' })
                        )}
                    >
                        {link.label}
                    </span>

                    {:else}
                        <a
                            href={link.url ?? undefined}
                            use:inertia={{ preserveState: true}}
                            class={cn(
                            buttonVariants({ variant: 'ghost', size: 'icon' }),
                            'hidden sm:inline-flex'
                        )}
                        >
                            {link.label}
                        </a>
                    {/if}
                </li>
            {/each}

            <li>
                <a
                    href={nextLink?.url ?? undefined}
                    use:inertia={{ preserveState: true }}
                    class={cn(
                    buttonVariants({ variant: 'ghost', size: 'default' }),
                    'gap-1 pr-2.5',
                    !nextLink?.url && 'pointer-events-none opacity-50'
                )}
                >
                    <span class="hidden sm:block">Next</span>
                    <ChevronRight class="h-4 w-4" />
                </a>
            </li>
        </ul>
    {/key}
</nav>
