<script lang="ts">
    import { Link, page } from '@inertiajs/svelte';
    import AppearanceToggle from '@/components/AppearanceToggle.svelte';
    import NavUser from '@/components/NavUser.svelte';
    import { buttonVariants } from '@/components/ui/button';
    import { login } from '@/routes';
    import { index } from '@/routes/map';

    const appName = import.meta.env.VITE_APP_NAME;
    const auth = $derived(page.props.auth);
</script>

<header
    class="sticky top-0 z-50 w-full border-b border-border shrink-0 bg-background"
>
    <div class="flex px-3 py-2 items-center justify-between">
        <Link class="flex items-center " href={index()} preserveState>
            <span class="font-bold text-2xl sm:inline-block">{appName}</span>
        </Link>

        <nav class="flex items-center gap-2">
            <AppearanceToggle />

            {#if auth.user}
                <NavUser />
            {:else}
                <Link
                    href={login()}
                    class={buttonVariants({ variant: 'default' })}
                    as="button"
                >
                    Log in
                </Link>
            {/if}
        </nav>
    </div>
</header>
