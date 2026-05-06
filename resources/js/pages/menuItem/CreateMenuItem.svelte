<script lang="ts">
    import { Link, useForm } from '@inertiajs/svelte';
    import { ArrowLeft } from 'lucide-svelte';
    import { Button, buttonVariants } from '@/components/ui/button';
    import * as Card from '@/components/ui/card';
    import * as Field from '@/components/ui/field/index';
    import { Input } from '@/components/ui/input';
    import { Textarea } from '@/components/ui/textarea';
    import * as ToggleGroup from '@/components/ui/toggle-group/index';
    import UploadSinglePhotoContainer from '@/components/UploadSinglePhotoContainer.svelte';
    import { show } from '@/routes/map';
    import { store } from '@/routes/map/menuitem';

    let {
        allergens,
        dietaryTags,
        osmData
    }: {
        allergens: App.Data.AllergenData[];
        dietaryTags: App.Data.DietaryTagData[];
        osmData: App.Data.OsmData.OsmFeatureData;
    } = $props();

    const form = useForm<{
        name: string;
        description: string;
        dietary_tags: string[];
        allergens: string[];
        photo: File | null;
    }>({
        name: '',
        description: '',
        dietary_tags: [],
        allergens: [],
        photo: null
    }).withPrecognition(store(osmData));

    function submit(e: Event) {
        e.preventDefault();

        console.log(form.photo);

        form.submit(store(osmData));
    }
</script>

<div class="p-4">
    <div class="flex items-center gap-4 mb-6">
        <Link
            class={buttonVariants({
                variant: 'ghost',
                size: 'icon',
                class: 'self-center',
            })}
            href={show(osmData)}
        >
            <ArrowLeft class="w-6 h-6" />
        </Link>

        <div>
            <h1 class="text-2xl font-bold tracking-tight">
                Add Menu Item to {osmData.name}
            </h1>
        </div>
    </div>

    <form onsubmit={submit}>
        <Field.Group>
            <Field.Set>
                <Card.Root>
                    <Card.Content>
                        <Field.Group>
                            <Field.Field>
                                <Field.Label
                                    for="menu-item-name"
                                    data-invalid={form.errors.name
                                        ? true
                                        : undefined}
                                >
                                    Item name
                                </Field.Label>

                                <Input
                                    id="menu-item-name"
                                    bind:value={form.name}
                                    onblur={() => form.validate('name')}
                                    placeholder="e.g. Truffle Parmesan Fries"
                                    disabled={form.processing}
                                    aria-invalid={form.errors.name
                                        ? true
                                        : undefined}
                                />

                                {#if form.errors.name}
                                    <Field.Error>{form.errors.name}</Field.Error
                                    >
                                {/if}
                            </Field.Field>

                            <Field.Field>
                                <Field.Label
                                    for="menu-item-description"
                                    data-invalid={form.errors.description
                                        ? true
                                        : undefined}
                                >
                                    Description
                                </Field.Label>

                                <Textarea
                                    id="menu-item-description"
                                    bind:value={form.description}
                                    placeholder="Briefly describe the ingredients and preparation..."
                                    disabled={form.processing}
                                    rows={3}
                                    class="resize-none"
                                />

                                {#if form.errors.description}
                                    <Field.Error
                                    >{form.errors.description}</Field.Error
                                    >
                                {/if}
                            </Field.Field>
                        </Field.Group>
                    </Card.Content>
                </Card.Root>

                <Card.Root>
                    <Card.Content class="space-y-8">
                        <Field.Group>
                            <Field.Field>
                                <Field.Legend variant="label">Dietary Attributes</Field.Legend>
                                <ToggleGroup.Root
                                    type="multiple"
                                    bind:value={form.dietary_tags}
                                    class="flex flex-wrap justify-start"
                                    variant="outline"
                                    spacing={2}
                                >
                                    {#each dietaryTags as tag (tag.id)}
                                        <ToggleGroup.Item
                                            value={tag.id.toString()}
                                            variant="outline"
                                            class="data-[state=on]:bg-primary data-[state=on]:text-primary-foreground transition-colors"
                                            aria-label="Toggle {tag.name}"
                                            disabled={form.processing}
                                        >
                                            {tag.name}
                                        </ToggleGroup.Item>
                                    {/each}
                                </ToggleGroup.Root>
                            </Field.Field>

                            <Field.Set>
                                <Field.Legend variant="label"
                                >Allergens
                                </Field.Legend
                                >

                                <ToggleGroup.Root
                                    type="multiple"
                                    bind:value={form.allergens}
                                    class="flex flex-wrap justify-start gap-2"
                                    variant="outline"
                                    spacing={2}
                                >
                                    {#each allergens as allergen (allergen.id)}
                                        <ToggleGroup.Item
                                            value={allergen.id.toString()}
                                            variant="outline"
                                            class="data-[state=on]:bg-primary data-[state=on]:text-primary-foreground transition-colors"
                                        >
                                            {allergen.name}
                                        </ToggleGroup.Item>
                                    {/each}
                                </ToggleGroup.Root>
                            </Field.Set>
                        </Field.Group>
                    </Card.Content>
                </Card.Root>

                <Card.Root>
                    <Card.Content>
                        <UploadSinglePhotoContainer
                            bind:file={form.photo}
                            invalid={form.errors.photo}
                            disabled={form.processing}
                            maxSizeMB={5}
                            onReject={(message) =>
                                form.setError('photo', message)}
                        />
                    </Card.Content>
                </Card.Root>
            </Field.Set>

            <Field.Field>
                <Button type="submit" disabled={form.processing}>Submit</Button>
            </Field.Field>
        </Field.Group>
    </form>
</div>
