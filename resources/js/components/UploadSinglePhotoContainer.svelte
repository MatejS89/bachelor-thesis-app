<script lang="ts">
    import { ImagePlus, X } from 'lucide-svelte';
    import { Button } from '@/components/ui/button';
    import * as Empty from '@/components/ui/empty/index';
    import * as Field from '@/components/ui/field/index';

    let {
        file = $bindable(null),
        invalid = undefined,
        disabled = false,
        maxSizeMB = 5,
        accept = 'image/jpeg, image/png, image/webp',
        onReject
    }: {
        file: File | null;
        invalid?: string;
        disabled?: boolean;
        maxSizeMB?: number;
        accept?: string;
        onReject?: (reason: string) => void;
    } = $props();

    let fileInput = $state<HTMLInputElement | null>(null);
    let previewUrl = $state<string | null>(null);

    $effect(() => {
        if (file) {
            const url = URL.createObjectURL(file);
            previewUrl = url;

            return () => URL.revokeObjectURL(url);
        } else {
            previewUrl = null;
        }
    });

    function handleSelectedFile(f: File | undefined | null) {
        if (!f) {
            return;
        }

        if (!f.type.startsWith('image/')) {
            onReject?.('Please select a valid image file.');

            return;
        }

        const fileSizeMB = f.size / (1024 * 1024);

        if (fileSizeMB > maxSizeMB) {
            onReject?.(`File size must be less than ${maxSizeMB}MB.`);

            return;
        }

        file = f;
    }

    function onFileChange(e: Event) {
        const target = e.target as HTMLInputElement;
        handleSelectedFile(target.files?.[0]);
        target.value = '';
    }
</script>

<Field.Field data-invalid={invalid ? true : undefined}>
    <Field.Label for="photo">Photo</Field.Label>

    {#if previewUrl}
        <div class="group relative aspect-4/3 max-h-60 overflow-hidden rounded-lg border bg-muted">
            <img src={previewUrl} alt="Upload preview" class="h-full w-full object-cover" />
            <div
                class="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity focus-within:opacity-100 group-hover:opacity-100">
                <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    onclick={() => (file = null)}
                    {disabled}
                    class="gap-2"
                >
                    <X class="h-4 w-4" />
                    Remove Photo
                </Button>
            </div>
        </div>
    {:else}
        <Empty.Root>
            <Empty.Media>
                <ImagePlus />
            </Empty.Media>

            <Empty.Title>
                No photo added
            </Empty.Title>

            <Empty.Content>
                <Button
                    variant="outline"
                    size="sm"
                    type="button"
                    onclick={() => fileInput?.click()}
                    {disabled}>
                    Add photo
                </Button>
            </Empty.Content>
        </Empty.Root>
    {/if}

    <input
        id="photo"
        type="file"
        {accept}
        class="hidden"
        aria-invalid={invalid ? true : undefined}
        bind:this={fileInput}
        onchange={onFileChange}
        {disabled}
    />

    {#if invalid}
        <Field.Error>
            {invalid}
        </Field.Error>
    {/if}
</Field.Field>
