import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../wayfinder'
/**
* @see \App\Http\Controllers\MapController::data
* @see app/Http/Controllers/MapController.php:20
* @route '/map-data'
*/
export const data = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: data.url(options),
    method: 'get',
})

data.definition = {
    methods: ["get","head"],
    url: '/map-data',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\MapController::data
* @see app/Http/Controllers/MapController.php:20
* @route '/map-data'
*/
data.url = (options?: RouteQueryOptions) => {
    return data.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\MapController::data
* @see app/Http/Controllers/MapController.php:20
* @route '/map-data'
*/
data.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: data.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\MapController::data
* @see app/Http/Controllers/MapController.php:20
* @route '/map-data'
*/
data.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: data.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\MapController::data
* @see app/Http/Controllers/MapController.php:20
* @route '/map-data'
*/
const dataForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: data.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\MapController::data
* @see app/Http/Controllers/MapController.php:20
* @route '/map-data'
*/
dataForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: data.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\MapController::data
* @see app/Http/Controllers/MapController.php:20
* @route '/map-data'
*/
dataForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: data.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

data.form = dataForm

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

const map = {
    update: Object.assign(update, update),
}

export default map