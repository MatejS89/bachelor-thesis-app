import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\OsmDataController::mapData
* @see app/Http/Controllers/OsmDataController.php:18
* @route '/map-data'
*/
export const mapData = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: mapData.url(options),
    method: 'get',
})

mapData.definition = {
    methods: ["get","head"],
    url: '/map-data',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\OsmDataController::mapData
* @see app/Http/Controllers/OsmDataController.php:18
* @route '/map-data'
*/
mapData.url = (options?: RouteQueryOptions) => {
    return mapData.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\OsmDataController::mapData
* @see app/Http/Controllers/OsmDataController.php:18
* @route '/map-data'
*/
mapData.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: mapData.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\OsmDataController::mapData
* @see app/Http/Controllers/OsmDataController.php:18
* @route '/map-data'
*/
mapData.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: mapData.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\OsmDataController::mapData
* @see app/Http/Controllers/OsmDataController.php:18
* @route '/map-data'
*/
const mapDataForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: mapData.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\OsmDataController::mapData
* @see app/Http/Controllers/OsmDataController.php:18
* @route '/map-data'
*/
mapDataForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: mapData.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\OsmDataController::mapData
* @see app/Http/Controllers/OsmDataController.php:18
* @route '/map-data'
*/
mapDataForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: mapData.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

mapData.form = mapDataForm

/**
* @see \App\Http\Controllers\OsmDataController::index
* @see app/Http/Controllers/OsmDataController.php:75
* @route '/map'
*/
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/map',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\OsmDataController::index
* @see app/Http/Controllers/OsmDataController.php:75
* @route '/map'
*/
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\OsmDataController::index
* @see app/Http/Controllers/OsmDataController.php:75
* @route '/map'
*/
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\OsmDataController::index
* @see app/Http/Controllers/OsmDataController.php:75
* @route '/map'
*/
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\OsmDataController::index
* @see app/Http/Controllers/OsmDataController.php:75
* @route '/map'
*/
const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\OsmDataController::index
* @see app/Http/Controllers/OsmDataController.php:75
* @route '/map'
*/
indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\OsmDataController::index
* @see app/Http/Controllers/OsmDataController.php:75
* @route '/map'
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
* @see \App\Http\Controllers\OsmDataController::search
* @see app/Http/Controllers/OsmDataController.php:40
* @route '/map/search'
*/
export const search = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: search.url(options),
    method: 'get',
})

search.definition = {
    methods: ["get","head"],
    url: '/map/search',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\OsmDataController::search
* @see app/Http/Controllers/OsmDataController.php:40
* @route '/map/search'
*/
search.url = (options?: RouteQueryOptions) => {
    return search.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\OsmDataController::search
* @see app/Http/Controllers/OsmDataController.php:40
* @route '/map/search'
*/
search.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: search.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\OsmDataController::search
* @see app/Http/Controllers/OsmDataController.php:40
* @route '/map/search'
*/
search.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: search.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\OsmDataController::search
* @see app/Http/Controllers/OsmDataController.php:40
* @route '/map/search'
*/
const searchForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: search.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\OsmDataController::search
* @see app/Http/Controllers/OsmDataController.php:40
* @route '/map/search'
*/
searchForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: search.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\OsmDataController::search
* @see app/Http/Controllers/OsmDataController.php:40
* @route '/map/search'
*/
searchForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: search.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

search.form = searchForm

/**
* @see \App\Http\Controllers\OsmDataController::show
* @see app/Http/Controllers/OsmDataController.php:52
* @route '/map/{osmData}'
*/
export const show = (args: { osmData: number | { id: number } } | [osmData: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/map/{osmData}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\OsmDataController::show
* @see app/Http/Controllers/OsmDataController.php:52
* @route '/map/{osmData}'
*/
show.url = (args: { osmData: number | { id: number } } | [osmData: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { osmData: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { osmData: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            osmData: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        osmData: typeof args.osmData === 'object'
        ? args.osmData.id
        : args.osmData,
    }

    return show.definition.url
            .replace('{osmData}', parsedArgs.osmData.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\OsmDataController::show
* @see app/Http/Controllers/OsmDataController.php:52
* @route '/map/{osmData}'
*/
show.get = (args: { osmData: number | { id: number } } | [osmData: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\OsmDataController::show
* @see app/Http/Controllers/OsmDataController.php:52
* @route '/map/{osmData}'
*/
show.head = (args: { osmData: number | { id: number } } | [osmData: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\OsmDataController::show
* @see app/Http/Controllers/OsmDataController.php:52
* @route '/map/{osmData}'
*/
const showForm = (args: { osmData: number | { id: number } } | [osmData: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\OsmDataController::show
* @see app/Http/Controllers/OsmDataController.php:52
* @route '/map/{osmData}'
*/
showForm.get = (args: { osmData: number | { id: number } } | [osmData: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\OsmDataController::show
* @see app/Http/Controllers/OsmDataController.php:52
* @route '/map/{osmData}'
*/
showForm.head = (args: { osmData: number | { id: number } } | [osmData: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: show.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

show.form = showForm

const OsmDataController = { mapData, index, search, show }

export default OsmDataController