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
        osmAtmosphereTags,
        osmBooleanValues,
        osmContactTags,
        osmCuisineValues,
        osmDietTags,
        osmFacilityTags,
        osmFoodOptionTags,
        osmIdentityTags,
        osmServiceTags
    } from '@/lib/osm-tags';
    import { show, update } from '@/routes/map';
    import type { ImageItem } from '@/types/imageitem';

    let { osmData }: { osmData: App.Data.OsmData.OsmFeatureData } = $props();

    const standardTagKeys = [
        ...osmServiceTags,
        ...osmFacilityTags,
        ...osmAtmosphereTags,
        ...osmFoodOptionTags,
        ...osmContactTags,
        ...osmIdentityTags,
        { key: 'stars' },
        { key: 'michelin_guide' },
        { key: 'breakfast' },
        { key: 'happy_hours' },
        { key: 'description' }
    ].map((t) => t.key);

    function normalizeTags(tags: Record<string, unknown> = {}) {
        return Object.fromEntries(
            Object.entries(tags).map(([key, value]) => [
                key,
                value === null || value === undefined ? '' : String(value)
            ])
        );
    }

    function initialFormData() {
        const photos: ImageItem[] = (osmData.photos || []).map((photo) => ({
            id: photo.id.toString(),
            url: photo.url,
            isExisting: true
        }));

        const allTags = normalizeTags(osmData.tags ?? {});

        const cuisine = (allTags.cuisine ?? '')
            .split(';')
            .map((c) => c.trim())
            .filter(Boolean);

        const diet: Record<string, string> = {};

        for (const tag of osmDietTags) {
            const suffix = tag.key.replace('diet:', '');
            const v = allTags[tag.key];

            if (v) {
diet[suffix] = v;
}
        }

        const tags: Record<string, string> = {};

        for (const key of standardTagKeys) {
            if (allTags[key] !== undefined) {
                tags[key] = allTags[key];
            }
        }

        return {
            name: osmData.name ?? '',
            type: osmData.type ?? osmData.tags?.amenity ?? '',
            cuisine,
            diet,
            photos,
            opening_hours: allTags.opening_hours ?? '',
            tags
        };
    }

    const form = useForm<{
        name: string;
        type: string;
        cuisine: string[];
        diet: Record<string, string>;
        photos: ImageItem[];
        opening_hours: string;
        tags: Record<string, string>;
    }>(initialFormData());

    function onSubmit(e: Event) {
        e.preventDefault();

        form.submit(update(osmData));
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
                                >Amenity type
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
                                keys={osmDietTags.map((t) => ({
                                    key: t.key.replace('diet:', ''),
                                    label: t.label
                                }))}
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
                    <DragAndDropPhotoContainer bind:items={form.photos} />
                </Field.Field>
            </Field.Set>

            <Field.Field orientation="horizontal">
                <Button type="submit" class="w-full">Submit</Button>
            </Field.Field>
        </Field.Group>
    </form>
</div>
