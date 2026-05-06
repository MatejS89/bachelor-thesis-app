<script lang="ts">
    import { page } from '@inertiajs/svelte';
    import { ChevronDown } from 'lucide-svelte';
    import { Button } from '@/components/ui/button';

    import * as DropdownMenu from '@/components/ui/dropdown-menu/index';
    import UserInfo from '@/components/UserInfo.svelte';
    import UserMenuContent from '@/components/UserMenuContent.svelte';

    const user = $derived(page.props.auth.user);
    let isMobile = true;
</script>

<DropdownMenu.Root>
    <DropdownMenu.Trigger>
        {#snippet child({ props })}
            <Button {...props}>
                <UserInfo {user} />
                <ChevronDown class="ml-auto size-4" />
            </Button>
        {/snippet}
    </DropdownMenu.Trigger>
    <DropdownMenu.Content
        class="w-full min-w-0 rounded-lg"
        side={!isMobile ? 'left' : 'top'}
        align="end"
        sideOffset={4}
    >
        <UserMenuContent {user} />
    </DropdownMenu.Content>
</DropdownMenu.Root>
