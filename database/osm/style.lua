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
    }}
}

function process_tags(object, geometry)
    if not geometry then
        return
    end

    if not object.tags.name then
        return
    end

    places:insert({
        name = object.tags.name,
        type = object.tags.amenity,
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
    process_tags(object, object:as_point())
end

function osm2pgsql.process_way(object)
    if object.is_closed and object.tags.building then
        process_tags(object, object:as_polygon():centroid())
    end
end

function osm2pgsql.process_relation(object)
    if object.tags.amenity == 'restaurant' and object.tags.type == 'multipolygon' then
        process_tags(object, object:as_multipolygon():centroid())
    end
end
