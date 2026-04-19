<script lang="ts">
    import { Link, page } from '@inertiajs/svelte';
    import NavUser from '@/components/NavUser.svelte';
    import { buttonVariants } from '@/components/ui/button';
    import { login } from '@/routes';
    import { index } from '@/routes/map';

    const auth = $derived(page.props.auth);
</script>

<header class="sticky top-0 z-50 w-full border-b border-border shrink-0 bg-background">
    <div class="px-3 py-2 lg:p-4 flex items-center justify-between">
        <Link class="flex items-center space-x-2" href={index()} preserveState>
                <span class="font-bold text-2xl sm:inline-block">
                    Haven
                </span>
        </Link>

        {#if auth.user}
            <NavUser />
        {:else}
            <Link
                href={login()}
                class={buttonVariants({ variant: "default" })}
                as="button"
            >
                Log in
            </Link>
        {/if}
    </div>
</header>
