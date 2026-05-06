<script lang="ts">
    import { ArrowRight } from 'lucide-svelte';
    import AppHead from '@/components/AppHead.svelte';
    import { Button } from '@/components/ui/button';
    import { Card, CardContent } from '@/components/ui/card';
    import { index as mapIndex } from '@/routes/map';

    const appName = import.meta.env.VITE_APP_NAME;
</script>

<AppHead title="Welcome" />

<div class="flex min-h-screen w-full items-center justify-center bg-muted px-6 py-16">
    <Card class="w-full max-w-2xl rounded-xl">
        <CardContent class="flex flex-col items-center gap-8 px-8 py-12 text-center sm:px-12">
            <h1 class="text-5xl font-bold tracking-tight sm:text-6xl">
                Welcome to <span class="text-secondary">{appName}</span>
            </h1>

            <p class="max-w-xl text-lg leading-relaxed text-muted-foreground">
                Find restaurants that fit the way you eat. {appName} helps you
                search for places based on your food intolerances and allergens,
                powered by community-maintained
                <a
                    href="https://www.openstreetmap.org"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="font-medium text-foreground underline underline-offset-4 decoration-primary/60 hover:decoration-primary"
                >
                    OpenStreetMap
                </a>
                data.
            </p>

            <Button href={mapIndex().url} size="lg">
                Explore the map
                <ArrowRight class="size-4 transition-transform group-hover:translate-x-0.5" />
            </Button>
        </CardContent>
    </Card>
</div>
