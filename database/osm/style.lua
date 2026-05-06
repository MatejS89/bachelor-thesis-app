local places = osm2pgsql.define_table {
    name = 'osm_data',
    ids = {
        type = 'any',
        id_column = 'osm_id',
        type_column = 'osm_type'
    },
    columns = { {
        column = 'id',
        sql_type = 'bigserial PRIMARY KEY',
        create_only = true
    }, {
        column = 'name',
        type = 'text'
    }, {
        column = 'type',
        type = 'text'
    }, {
        column = 'tags',
        type = 'jsonb'
    }, {
        column = 'geom',
        type = 'point',
        projection = 4326,
        not_null = true
    } },
}

local get_matching_amenitites = osm2pgsql.make_check_values_func({
    'bar',
    'biergarten',
    'cafe',
    'fast_food',
    'food_court',
    'ice_cream',
    'pub',
    'restaurant'
})

local excluded_tags = {
    name = true,
    amenity = true
}

local function clean_tags(tags, exclusions)
    local result = {}

    for k, v in pairs(tags) do
        if not exclusions[k] then
            result[k] = v
        end
    end

    return result
end

function process_tags(object, geometry)
    if not geometry then return end
    if not object.tags.name then return end

    local amenity_type = get_matching_amenitites(object.tags.amenity)

    if not amenity_type then return end

    places:insert({
        name = object.tags.name,
        type = amenity_type,
        tags = clean_tags(object.tags, excluded_tags),
        geom = geometry
    })
end

function osm2pgsql.process_node(object)
    process_tags(object, object:as_point())
end

function osm2pgsql.process_way(object)
    if object.is_closed then
        process_tags(object, object:as_polygon():centroid())
    end
end

function osm2pgsql.process_relation(object)
    if object.tags.type == 'multipolygon' then
        process_tags(object, object:as_multipolygon():centroid())
    end
end
