<script lang="ts">
    import { Moon, Sun, Monitor } from 'lucide-svelte';
    import { Button } from '@/components/ui/button';
    import * as DropdownMenu from '@/components/ui/dropdown-menu/index';
    import { themeState } from '@/state/theme.svelte.js';
    import type { Appearance } from '@/types';

    const theme = themeState();
</script>

<DropdownMenu.Root>
    <DropdownMenu.Trigger>
        {#snippet child({ props })}
            <Button {...props} variant="ghost" size="icon" aria-label="Toggle theme">
                {#if theme.appearance.value === 'light'}
                    <Sun class="h-5 w-5" />
                {:else if theme.appearance.value === 'dark'}
                    <Moon class="h-5 w-5" />
                {:else}
                    <Monitor class="h-5 w-5" />
                {/if}
            </Button>
        {/snippet}
    </DropdownMenu.Trigger>

    <DropdownMenu.Content align="end">
        <DropdownMenu.RadioGroup
            value={theme.appearance.value}
            onValueChange={(value) => theme.updateAppearance(value as Appearance)}
        >
            <DropdownMenu.RadioItem value="light">
                <Sun class="mr-2 h-4 w-4" />
                Light
            </DropdownMenu.RadioItem>
            <DropdownMenu.RadioItem value="dark">
                <Moon class="mr-2 h-4 w-4" />
                Dark
            </DropdownMenu.RadioItem>
            <DropdownMenu.RadioItem value="system">
                <Monitor class="mr-2 h-4 w-4" />
                System
            </DropdownMenu.RadioItem>
        </DropdownMenu.RadioGroup>
    </DropdownMenu.Content>
</DropdownMenu.Root>
