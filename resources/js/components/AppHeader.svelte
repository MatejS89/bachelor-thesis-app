<script lang="ts">
    import { Link, page } from '@inertiajs/svelte';
    import * as Avatar from '@/components/ui/avatar/index';
    import { getInitials } from '@/lib/initials';
    import { index } from '@/routes/map';

    const auth = $derived(page.props.auth);
</script>

<header class="sticky top-0 z-50 w-full border-b border-border shrink-0 bg-background">
    <div class="p-2 lg:p-4 flex items-center justify-between">
        <Link class="flex items-center space-x-2" href={index()} preserveState>
                <span class="font-bold text-2xl sm:inline-block">
                    Haven
                </span>
        </Link>

        <Avatar.Root
            class="size-8 overflow-hidden rounded-full"
        >
            <!--{#if auth.user.avatar}-->
            <!--    <Avatar.Image-->
            <!--        src={auth.user.avatar}-->
            <!--        alt={auth.user.name}-->
            <!--    />-->
            <!--{/if}-->
            <Avatar.Fallback
                class="rounded-lg bg-neutral-200 font-semibold text-black dark:bg-neutral-700 dark:text-white"
            >
                <!--{getInitials(auth.user?.name)}-->
                TU
            </Avatar.Fallback>
        </Avatar.Root>
    </div>
</header>
