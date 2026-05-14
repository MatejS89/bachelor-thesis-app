<script lang="ts">
    import { Link, useForm } from '@inertiajs/svelte';
    import { ArrowLeft } from 'lucide-svelte';
    import ComboboxSelect from '@/components/ComboboxSelect.svelte';
    import DragAndDropPhotoContainer from '@/components/DragAndDropPhotoContainer.svelte';
    import KeyValueTagInput from '@/components/KeyValueTagInput.svelte';
    import MultiTagInput from '@/components/MultiTagInput.svelte';
    import OpeningHoursEditor from '@/components/OpeningHoursEditor.svelte';
    import { Button, buttonVariants } from '@/components/ui/button';
    import * as Card from '@/components/ui/card';
    import * as Field from '@/components/ui/field/index';
    import { Input } from '@/components/ui/input';
    import {
        osmAmenityTypes,
        osmBooleanValues,
        osmCuisineValues,
        osmDietTags
    } from '@/lib/osm-tags';
    import { show, update } from '@/routes/map';
    import type { ImageItem } from '@/types/imageitem';

    let {
        osmData,
        maxPhotos,
        maxPhotoSizeKb
    }: {
        osmData: App.Data.OsmData.UpdateOsmDataData;
        maxPhotos: number;
        maxPhotoSizeKb: number;
    } = $props();


    function initialFormData() {
        return {
            name: osmData.name,
            type: osmData.type ?? '',
            cuisine: [...osmData.cuisine],
            diet: Object.fromEntries(
                Object.entries(osmData.diet).map(([k, v]) => [k, v ?? ''])
            ),
            photos: osmData.photos ? osmData.photos.map(
                (photo): ImageItem => ({
                    id: String(photo.id),
                    url: String(photo.url),
                    isExisting: true
                })
            ) : [],
            opening_hours: osmData.opening_hours ?? '',
            id: osmData.id
        };
    }

    const form = useForm<{
        name: string;
        type: string;
        cuisine: string[];
        diet: Record<string, string>;
        photos: ImageItem[];
        opening_hours: string;
        id: number;
    }>(initialFormData());

    function onSubmit(e: Event) {
        e.preventDefault();

        form.transform((data) => ({
            ...data,
            photos: data.photos.map((p) =>
                p.isExisting
                    ? { kind: 'existing', id: Number(p.id) }
                    : { kind: 'new', file: p.file }
            )
        })).submit(update(osmData));
    }
</script>

<div class="p-3 h-full w-full flex flex-col gap-x-4 gap-y-2 overflow-y-auto">
    <header class="grid grid-cols-[auto_1fr] gap-x-4 gap-y-2">
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
        <h1 class="text-3xl font-bold tracking-tight self-center">
            Edit {osmData.name}
        </h1>
    </header>

    <form onsubmit={onSubmit} class="pb-8">
        <Field.Group class="gap-4">
            <Card.Root>
                <Card.Content>
                    <Field.Group>
                        <Field.Group class="flex-col gap-4 md:flex-row">
                            <Field.Field>
                                <Field.Label for="name">Name</Field.Label>
                                <Input
                                    id="name"
                                    type="text"
                                    bind:value={form.name}
                                />
                            </Field.Field>

                            <Field.Field>
                                <Field.Label for="type"
                                >Restaurant type
                                </Field.Label
                                >
                                <ComboboxSelect
                                    id="type"
                                    bind:value={form.type}
                                    options={osmAmenityTypes}
                                    emptyOptionLabel="Unknown"
                                    placeholder="Select amenity…"
                                    searchPlaceholder="Search amenities…"
                                    emptyText="No amenities match."
                                />
                            </Field.Field>
                        </Field.Group>

                        <Field.Field>
                            <Field.Label for="tag-cuisine">Cuisine</Field.Label>
                            <MultiTagInput
                                id="tag-cuisine"
                                bind:value={form.cuisine}
                                suggestions={osmCuisineValues}
                                allowCustom={false}
                                placeholder="Add cuisine…"
                                searchPlaceholder="Search cuisines…"
                                emptyText="No cuisines match."
                            />
                        </Field.Field>

                        <Field.Field>
                            <Field.Label for="tag-dietary">Dietary</Field.Label>
                            <KeyValueTagInput
                                id="tag-dietary"
                                bind:value={form.diet}
                                keys={osmDietTags}
                                valueOptions={osmBooleanValues}
                                defaultValue="yes"
                                placeholder="Add dietary option…"
                                searchPlaceholder="Search dietary options…"
                                valueSearchPlaceholder="Set availability…"
                                emptyText="No dietary options match."
                            />
                        </Field.Field>
                    </Field.Group>
                </Card.Content>
            </Card.Root>

            <Field.Set class="rounded-lg border p-4">
                <Field.Legend>Opening hours</Field.Legend>
                <Field.Field>
                    <OpeningHoursEditor bind:value={form.opening_hours} />
                </Field.Field>
            </Field.Set>

            <Field.Set class="rounded-lg border p-4">
                <Field.Field>
                    <DragAndDropPhotoContainer
                        bind:items={form.photos}
                        maxFiles={maxPhotos}
                        maxFileSizeKb={maxPhotoSizeKb}
                    />
                </Field.Field>
            </Field.Set>

            <Field.Field orientation="horizontal">
                <Button type="submit" class="w-full">Submit</Button>
            </Field.Field>
        </Field.Group>
    </form>
</div>
