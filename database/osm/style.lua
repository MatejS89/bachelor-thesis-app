local places = osm2pgsql.define_table {
    name = 'osm_data',
    ids = {
        type = 'any',
        id_column = 'osm_id',
        type_column = 'osm_type'
    },
    columns = {{
        column = 'id',
        sql_type = 'serial PRIMARY KEY',
        create_only = true
    }, {
        column = 'name',
        type = 'text'
    }, {
        column = 'type',
        type = 'text'
    }, {
        column = 'cuisine',
        type = 'text'
    }, {
        column = 'opening_hours',
        type = 'text'
    }, {
        column = 'street',
        type = 'text'
    }, {
        column = 'housenumber',
        type = 'text'
    }, {
        column = 'city',
        type = 'text'
    }, {
        column = 'postcode',
        type = 'text'
    }, {
        column = 'website',
        type = 'text'
    }, {
        column = 'phone',
        type = 'text'
    }, {
        column = 'email',
        type = 'text'
    }, {
        column = 'geom',
        type = 'point',
        projection = 4326,
        not_null = true
    }},
}

local target_amenities = {
    ['bar'] = true,
    ['biergarten'] = true,
    ['cafe'] = true,
    ['fast_food'] = true,
    ['food_court'] = true,
    ['ice_cream'] = true,
    ['pub'] = true,
    ['restaurant'] = true
}

local function get_matching_amenities(amenity_string)
    if not amenity_string then return nil end

    if target_amenities[amenity_string] then
        return amenity_string
    end

    if string.find(amenity_string, ';') then
        local matches = {}

        for val in string.gmatch(amenity_string, "([^;]+)") do
            val = val:match("^%s*(.-)%s*$")

            if target_amenities[val] then
                table.insert(matches, val)
            end
        end

        if #matches > 0 then
            return table.concat(matches, ";")
        end
    end

    return nil
end

function process_tags(object, geometry, matched_amenities)
    if not geometry then return end
    if not object.tags.name then return end

    places:insert({
        name = object.tags.name,
        type = matched_amenities,
        cuisine = object.tags.cuisine,
        opening_hours = object.tags.opening_hours,
        street = object.tags['addr:street'],
        housenumber = object.tags['addr:housenumber'] or object.tags['addr:conscriptionnumber'],
        city = object.tags['addr:city'],
        postcode = object.tags['addr:postcode'],
        website = object.tags.website or object.tags['contact:website'],
        phone = object.tags.phone or object.tags['contact:phone'],
        email = object.tags.email or object.tags['contact:email'],
        geom = geometry
    })
end

function osm2pgsql.process_node(object)
    local matched = get_matching_amenities(object.tags.amenity)

    if matched then
        process_tags(object, object:as_point(), matched)
    end
end

function osm2pgsql.process_way(object)
    if object.is_closed then
        local matched = get_matching_amenities(object.tags.amenity)

        if matched then
            process_tags(object, object:as_polygon():centroid(), matched)
        end
    end
end

function osm2pgsql.process_relation(object)
    if object.tags.type == 'multipolygon' then
        local matched = get_matching_amenities(object.tags.amenity)

        if matched then
            process_tags(object, object:as_multipolygon():centroid(), matched)
        end
    end
end
