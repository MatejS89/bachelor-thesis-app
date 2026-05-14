<script lang="ts">
    import type {
        DetailItem,
        IconComponent,
        StatusItem,
    } from '@/lib/osm-tag-format';
    import DetailRow from './DetailRow.svelte';
    import SectionShell from './SectionShell.svelte';
    import StatusRow from './StatusRow.svelte';

    type Props =
        | {
              icon: IconComponent;
              label: string;
              variant: 'detail';
              items: DetailItem[];
          }
        | {
              icon: IconComponent;
              label: string;
              variant: 'status';
              items: StatusItem[];
          };

    let props: Props = $props();
</script>

{#if props.items.length > 0}
    <SectionShell icon={props.icon} label={props.label}>
        {#each props.items as item (item.key)}
            {#if props.variant === 'status'}
                <StatusRow item={item as StatusItem} />
            {:else}
                <DetailRow item={item as DetailItem} />
            {/if}
        {/each}
    </SectionShell>
{/if}
