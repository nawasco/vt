require('dotenv').config();

module.exports = {
    db: {
      user:process.env.db_user,
      password:process.env.db_password,
      host:process.env.db_host,
      port:process.env.db_port,
      database:'gis_nawasco2',
    },
    layers : [
        {
          name: 'meter',
          geojsonFileName: __dirname + '/public/meter.geojson',
          select:`
          SELECT row_to_json(featurecollection) AS json FROM (
            SELECT
              'FeatureCollection' AS type,
              array_to_json(array_agg(feature)) AS features
            FROM (
              SELECT
              'Feature' AS type,
              ST_AsGeoJSON(ST_SetSRID(x.geom,4326))::json AS geometry,
              row_to_json((
                SELECT p FROM (
                  SELECT
                    cast(x.accountno as integer) as accountno, 
                    x.category, 
                    x.serial_no
                ) AS p
              )) AS properties
              FROM consumer_meters x
              WHERE NOT ST_IsEmpty(x.geom)
            ) AS feature
          ) AS featurecollection
          `
        },
    ],
};
