import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../wayfinder'
import review from './review'
import menuitem from './menuitem'
/**
* @see \App\Http\Controllers\OsmDataController::index
* @see app/Http/Controllers/OsmDataController.php:110
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
* @see app/Http/Controllers/OsmDataController.php:110
* @route '/map'
*/
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\OsmDataController::index
* @see app/Http/Controllers/OsmDataController.php:110
* @route '/map'
*/
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\OsmDataController::index
* @see app/Http/Controllers/OsmDataController.php:110
* @route '/map'
*/
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\OsmDataController::index
* @see app/Http/Controllers/OsmDataController.php:110
* @route '/map'
*/
const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\OsmDataController::index
* @see app/Http/Controllers/OsmDataController.php:110
* @route '/map'
*/
indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\OsmDataController::index
* @see app/Http/Controllers/OsmDataController.php:110
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
* @see app/Http/Controllers/OsmDataController.php:65
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
* @see app/Http/Controllers/OsmDataController.php:65
* @route '/map/search'
*/
search.url = (options?: RouteQueryOptions) => {
    return search.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\OsmDataController::search
* @see app/Http/Controllers/OsmDataController.php:65
* @route '/map/search'
*/
search.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: search.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\OsmDataController::search
* @see app/Http/Controllers/OsmDataController.php:65
* @route '/map/search'
*/
search.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: search.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\OsmDataController::search
* @see app/Http/Controllers/OsmDataController.php:65
* @route '/map/search'
*/
const searchForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: search.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\OsmDataController::search
* @see app/Http/Controllers/OsmDataController.php:65
* @route '/map/search'
*/
searchForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: search.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\OsmDataController::search
* @see app/Http/Controllers/OsmDataController.php:65
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
* @see app/Http/Controllers/OsmDataController.php:77
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
* @see app/Http/Controllers/OsmDataController.php:77
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
* @see app/Http/Controllers/OsmDataController.php:77
* @route '/map/{osmData}'
*/
show.get = (args: { osmData: number | { id: number } } | [osmData: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\OsmDataController::show
* @see app/Http/Controllers/OsmDataController.php:77
* @route '/map/{osmData}'
*/
show.head = (args: { osmData: number | { id: number } } | [osmData: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\OsmDataController::show
* @see app/Http/Controllers/OsmDataController.php:77
* @route '/map/{osmData}'
*/
const showForm = (args: { osmData: number | { id: number } } | [osmData: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\OsmDataController::show
* @see app/Http/Controllers/OsmDataController.php:77
* @route '/map/{osmData}'
*/
showForm.get = (args: { osmData: number | { id: number } } | [osmData: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\OsmDataController::show
* @see app/Http/Controllers/OsmDataController.php:77
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

/**
* @see \App\Http\Controllers\OsmDataController::data
* @see app/Http/Controllers/OsmDataController.php:42
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
* @see \App\Http\Controllers\OsmDataController::data
* @see app/Http/Controllers/OsmDataController.php:42
* @route '/map-data'
*/
data.url = (options?: RouteQueryOptions) => {
    return data.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\OsmDataController::data
* @see app/Http/Controllers/OsmDataController.php:42
* @route '/map-data'
*/
data.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: data.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\OsmDataController::data
* @see app/Http/Controllers/OsmDataController.php:42
* @route '/map-data'
*/
data.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: data.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\OsmDataController::data
* @see app/Http/Controllers/OsmDataController.php:42
* @route '/map-data'
*/
const dataForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: data.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\OsmDataController::data
* @see app/Http/Controllers/OsmDataController.php:42
* @route '/map-data'
*/
dataForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: data.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\OsmDataController::data
* @see app/Http/Controllers/OsmDataController.php:42
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
* @see \App\Http\Controllers\OsmDataController::edit
* @see app/Http/Controllers/OsmDataController.php:25
* @route '/map/{osmData}/edit'
*/
export const edit = (args: { osmData: number | { id: number } } | [osmData: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})

edit.definition = {
    methods: ["get","head"],
    url: '/map/{osmData}/edit',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\OsmDataController::edit
* @see app/Http/Controllers/OsmDataController.php:25
* @route '/map/{osmData}/edit'
*/
edit.url = (args: { osmData: number | { id: number } } | [osmData: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
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

    return edit.definition.url
            .replace('{osmData}', parsedArgs.osmData.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\OsmDataController::edit
* @see app/Http/Controllers/OsmDataController.php:25
* @route '/map/{osmData}/edit'
*/
edit.get = (args: { osmData: number | { id: number } } | [osmData: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\OsmDataController::edit
* @see app/Http/Controllers/OsmDataController.php:25
* @route '/map/{osmData}/edit'
*/
edit.head = (args: { osmData: number | { id: number } } | [osmData: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: edit.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\OsmDataController::edit
* @see app/Http/Controllers/OsmDataController.php:25
* @route '/map/{osmData}/edit'
*/
const editForm = (args: { osmData: number | { id: number } } | [osmData: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: edit.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\OsmDataController::edit
* @see app/Http/Controllers/OsmDataController.php:25
* @route '/map/{osmData}/edit'
*/
editForm.get = (args: { osmData: number | { id: number } } | [osmData: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: edit.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\OsmDataController::edit
* @see app/Http/Controllers/OsmDataController.php:25
* @route '/map/{osmData}/edit'
*/
editForm.head = (args: { osmData: number | { id: number } } | [osmData: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: edit.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

edit.form = editForm

/**
* @see \App\Http\Controllers\OsmDataController::update
* @see app/Http/Controllers/OsmDataController.php:34
* @route '/map/{osmData}'
*/
export const update = (args: { osmData: number | { id: number } } | [osmData: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put"],
    url: '/map/{osmData}',
} satisfies RouteDefinition<["put"]>

/**
* @see \App\Http\Controllers\OsmDataController::update
* @see app/Http/Controllers/OsmDataController.php:34
* @route '/map/{osmData}'
*/
update.url = (args: { osmData: number | { id: number } } | [osmData: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
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

    return update.definition.url
            .replace('{osmData}', parsedArgs.osmData.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\OsmDataController::update
* @see app/Http/Controllers/OsmDataController.php:34
* @route '/map/{osmData}'
*/
update.put = (args: { osmData: number | { id: number } } | [osmData: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

/**
* @see \App\Http\Controllers\OsmDataController::update
* @see app/Http/Controllers/OsmDataController.php:34
* @route '/map/{osmData}'
*/
const updateForm = (args: { osmData: number | { id: number } } | [osmData: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: update.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PUT',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\OsmDataController::update
* @see app/Http/Controllers/OsmDataController.php:34
* @route '/map/{osmData}'
*/
updateForm.put = (args: { osmData: number | { id: number } } | [osmData: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: update.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PUT',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

update.form = updateForm

const map = {
    index: Object.assign(index, index),
    search: Object.assign(search, search),
    show: Object.assign(show, show),
    review: Object.assign(review, review),
    menuitem: Object.assign(menuitem, menuitem),
    data: Object.assign(data, data),
    edit: Object.assign(edit, edit),
    update: Object.assign(update, update),
}

export default map