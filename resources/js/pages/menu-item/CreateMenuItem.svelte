<script lang="ts" module>
    import * as ToggleGroup from '@/components/ui/toggle-group/index';
    import FullScreenLayout from '@/layouts/FullScreenLayout.svelte';
    import MapLayout from '@/layouts/MapLayout.svelte';
    import { store } from '@/routes/map/menu-item';

    export const layout = [FullScreenLayout, MapLayout];
</script>

<script lang="ts">
    import { useForm } from '@inertiajs/svelte';
    import { Upload, X, ArrowLeft } from 'lucide-svelte';
    import { Button } from '@/components/ui/button';
    import * as Card from '@/components/ui/card';
    import { Input } from '@/components/ui/input';
    import { Label } from '@/components/ui/label';
    import { Textarea } from '@/components/ui/textarea';

    let { allergens, dietaryTags, osmData }: {
        allergens: App.Data.AllergenData[],
        dietaryTags: App.Data.DietaryTagData[],
        osmData: App.Data.OsmFeatureData
    } = $props();

    const form = useForm<{
        name: string
        description: string
        dietary_tags: string[]
        allergens: string[],
        photo: File | null
    }>({
        name: '',
        description: '',
        dietary_tags: [],
        allergens: [],
        photo: null
    }).withPrecognition(store(osmData));

    let fileInput: HTMLInputElement;
    let photoPreview = $state<string | null>(null);

    $effect(() => {
        if (form.photo) {
            const url = URL.createObjectURL(form.photo);
            photoPreview = url;

            return () => URL.revokeObjectURL(url);
        } else {
            photoPreview = null;
        }
    });

    function handleFileSelect(e: Event) {
        const target = e.target as HTMLInputElement;

        if (target.files && target.files.length > 0) {
            form.photo = target.files[0];
        }

        target.value = '';
    }

    function submit(e: Event) {
        e.preventDefault();

        form.submit(store(osmData));
    }
</script>

<div class="p-4">
    <div class="flex items-center gap-4 mb-6">
        <Button variant="ghost" size="icon" onclick={() => window.history.back()}>
            <ArrowLeft class="w-5 h-5" />
        </Button>
        <div>
            <h1 class="text-2xl font-bold tracking-tight">Add Menu Item to {osmData.name}</h1>
        </div>
    </div>

    <form onsubmit={submit} class="space-y-8">
        <Card.Root>
            <Card.Header>
                <Card.Title>Basic Information</Card.Title>
            </Card.Header>

            <Card.Content class="space-y-4">
                <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div class="space-y-2 md:col-span-2">
                        <Label for="menu-item-name">Item Name <span class="text-destructive">*</span></Label>
                        <Input
                            id="menu-item-name"
                            bind:value={form.name}
                            onblur={() => form.validate('name')}
                            placeholder="e.g. Truffle Parmesan Fries"
                            disabled={form.processing}
                            required
                        />
                        {#if form.errors.name}<p class="text-sm text-destructive">{form.errors.name}</p>{/if}
                    </div>
                </div>

                <div class="space-y-2">
                    <Label for="description">Description</Label>
                    <Textarea
                        id="description"
                        bind:value={form.description}
                        placeholder="Briefly describe the ingredients and preparation..."
                        disabled={form.processing}
                        rows={3}
                        class="resize-none"
                    />
                    {#if form.errors.description}<p class="text-sm text-destructive">{form.errors.description}</p>{/if}
                </div>
            </Card.Content>
        </Card.Root>

        <Card.Root>
            <Card.Header>
                <Card.Title>Categorization & Dietary</Card.Title>
            </Card.Header>
            <Card.Content class="space-y-6">
                <div class="flex flex-col gap-3">
                    <Label for="dietary_attributes">Dietary Attributes</Label>

                    <ToggleGroup.Root
                        id="dietary_attributes"
                        type="multiple"
                        bind:value={form.dietary_tags}
                        variant="outline"
                        spacing={2}
                        class="flex flex-row flex-wrap"
                    >
                        {#each dietaryTags as tag (tag.id)}
                            <ToggleGroup.Item
                                value={tag.id.toString()}
                                aria-label="Toggle {tag.name}"
                                disabled={form.processing}
                            >
                                {tag.name}
                            </ToggleGroup.Item>
                        {/each}
                    </ToggleGroup.Root>
                </div>

                <div class="flex flex-col gap-3">
                    <Label for="allergens">Allergens</Label>

                    <ToggleGroup.Root
                        id="dietary_attributes"
                        type="multiple"
                        bind:value={form.allergens}
                        variant="outline"
                        spacing={2}
                        class="flex flex-row flex-wrap"
                    >
                        {#each allergens as allergen (allergen.id)}
                            <ToggleGroup.Item
                                value={allergen.id.toString()}
                                aria-label="Toggle {allergen.name}"
                                disabled={form.processing}
                            >
                                {allergen.name}
                            </ToggleGroup.Item>
                        {/each}
                    </ToggleGroup.Root>
                </div>
            </Card.Content>
        </Card.Root>

        <Card.Root>
            <Card.Header>
                <Card.Title>Item Photo</Card.Title>
                <Card.Description>Upload a clear, appetizing photo of the dish.</Card.Description>
            </Card.Header>
            <Card.Content>
                {#if photoPreview}
                    <div class="relative w-full max-w-sm aspect-[4/3] rounded-lg overflow-hidden border bg-muted group">
                        <img src={photoPreview} alt="Menu item preview" class="w-full h-full object-cover" />
                        <div
                            class="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <Button
                                type="button"
                                variant="destructive"
                                size="sm"
                                onclick={() => form.photo = null}
                                class="gap-2"
                            >
                                <X class="w-4 h-4" />
                                Remove Photo
                            </Button>
                        </div>
                    </div>
                {:else}
                    <button
                        type="button"
                        class="flex flex-col items-center justify-center w-full max-w-sm aspect-[4/3] rounded-lg border-2 border-dashed border-muted-foreground/25 hover:bg-muted/50 hover:border-muted-foreground/50 transition-colors text-muted-foreground disabled:opacity-50 disabled:cursor-not-allowed"
                        onclick={() => fileInput.click()}
                        disabled={form.processing}
                    >
                        <Upload class="w-8 h-8 mb-3 text-muted-foreground/50" />
                        <span class="text-sm font-medium">Click to upload photo</span>
                        <span class="text-xs mt-1">JPEG, PNG up to 5MB</span>
                    </button>
                {/if}

                <input
                    type="file"
                    accept="image/*"
                    class="hidden"
                    bind:this={fileInput}
                    onchange={handleFileSelect}
                    disabled={form.processing}
                />
                {#if form.errors.photo}<p class="text-sm text-destructive mt-2">{form.errors.photo}</p>{/if}
            </Card.Content>
        </Card.Root>

        <div class="flex items-center justify-end gap-4 pt-4 border-t">
            <Button
                type="button"
                variant="outline"
                onclick={() => window.history.back()}
                disabled={form.processing}
            >
                Cancel
            </Button>
            <Button
                type="submit"
                disabled={form.processing || Object.keys(form.errors).length > 0}
                class="min-w-30"
                onclick={() => form.validate()}
            >
                {form.processing ? 'Saving...' : 'Save Menu Item'}
            </Button>
        </div>
    </form>
</div>
