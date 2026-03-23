import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults, validateParameters } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\MapController::index
* @see app/Http/Controllers/MapController.php:20
* @route '/map-data'
*/
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/map-data',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\MapController::index
* @see app/Http/Controllers/MapController.php:20
* @route '/map-data'
*/
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\MapController::index
* @see app/Http/Controllers/MapController.php:20
* @route '/map-data'
*/
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\MapController::index
* @see app/Http/Controllers/MapController.php:20
* @route '/map-data'
*/
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\MapController::index
* @see app/Http/Controllers/MapController.php:20
* @route '/map-data'
*/
const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\MapController::index
* @see app/Http/Controllers/MapController.php:20
* @route '/map-data'
*/
indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\MapController::index
* @see app/Http/Controllers/MapController.php:20
* @route '/map-data'
*/
indexForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

index.form = indexForm

/**
* @see \App\Http\Controllers\MapController::show
* @see app/Http/Controllers/MapController.php:28
* @route '/map/{feature?}'
*/
export const show = (args?: { feature?: number | { id: number } } | [feature: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/map/{feature?}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\MapController::show
* @see app/Http/Controllers/MapController.php:28
* @route '/map/{feature?}'
*/
show.url = (args?: { feature?: number | { id: number } } | [feature: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { feature: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { feature: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            feature: args[0],
        }
    }

    args = applyUrlDefaults(args)

    validateParameters(args, [
        "feature",
    ])

    const parsedArgs = {
        feature: typeof args?.feature === 'object'
        ? args.feature.id
        : args?.feature,
    }

    return show.definition.url
            .replace('{feature?}', parsedArgs.feature?.toString() ?? '')
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\MapController::show
* @see app/Http/Controllers/MapController.php:28
* @route '/map/{feature?}'
*/
show.get = (args?: { feature?: number | { id: number } } | [feature: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\MapController::show
* @see app/Http/Controllers/MapController.php:28
* @route '/map/{feature?}'
*/
show.head = (args?: { feature?: number | { id: number } } | [feature: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\MapController::show
* @see app/Http/Controllers/MapController.php:28
* @route '/map/{feature?}'
*/
const showForm = (args?: { feature?: number | { id: number } } | [feature: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\MapController::show
* @see app/Http/Controllers/MapController.php:28
* @route '/map/{feature?}'
*/
showForm.get = (args?: { feature?: number | { id: number } } | [feature: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\MapController::show
* @see app/Http/Controllers/MapController.php:28
* @route '/map/{feature?}'
*/
showForm.head = (args?: { feature?: number | { id: number } } | [feature: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: show.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

show.form = showForm

/**
* @see \App\Http\Controllers\MapController::update
* @see app/Http/Controllers/MapController.php:39
* @route '/map/{feature}'
*/
export const update = (args: { feature: number | { id: number } } | [feature: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: update.url(args, options),
    method: 'post',
})

update.definition = {
    methods: ["post"],
    url: '/map/{feature}',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\MapController::update
* @see app/Http/Controllers/MapController.php:39
* @route '/map/{feature}'
*/
update.url = (args: { feature: number | { id: number } } | [feature: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { feature: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { feature: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            feature: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        feature: typeof args.feature === 'object'
        ? args.feature.id
        : args.feature,
    }

    return update.definition.url
            .replace('{feature}', parsedArgs.feature.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\MapController::update
* @see app/Http/Controllers/MapController.php:39
* @route '/map/{feature}'
*/
update.post = (args: { feature: number | { id: number } } | [feature: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: update.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\MapController::update
* @see app/Http/Controllers/MapController.php:39
* @route '/map/{feature}'
*/
const updateForm = (args: { feature: number | { id: number } } | [feature: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: update.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\MapController::update
* @see app/Http/Controllers/MapController.php:39
* @route '/map/{feature}'
*/
updateForm.post = (args: { feature: number | { id: number } } | [feature: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: update.url(args, options),
    method: 'post',
})

update.form = updateForm

const MapController = { index, show, update }

export default MapController