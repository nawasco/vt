require('dotenv').config();

module.exports = {
    db: {
      user:process.env.db_user,
      password:process.env.db_password,
      host:process.env.db_host,
      port:process.env.db_port,
      database:process.env.db_name,
    },
    name: 'NAWASCO Vector Tiles',
    description: 'Vector tiles for water & sanitation data in Nanyuki Water and Sanitation company, Kenya',
    attribution: '©Nanyuki Water and Sanitation Co., Ltd.',
    mbtiles: __dirname + '/data/nanyuki.mbtiles',
    ghpages: __dirname + '/public/tiles',
    createPmtiles: true,
    minzoom: 10,
    maxzoom: 16,
    layers : [
        {
            name: 'pipeline',
            geojsonFileName: __dirname + '/pipeline.geojson',
            select: `
            SELECT row_to_json(featurecollection) AS json FROM (
                SELECT
                  'FeatureCollection' AS type,
                  array_to_json(array_agg(feature)) AS features
                FROM (
                  SELECT
                    'Feature' AS type,
                    id,
                    ST_AsGeoJSON(ST_SetSRID(ST_MakeValid(geom),4326))::json AS geometry,
                    row_to_json((
                      SELECT t FROM (
                        SELECT
                          16 as maxzoom,
                          10 as minzoom
                      ) AS t
                    )) AS tippecanoe,
                    row_to_json((
                      SELECT p FROM (
                        SELECT
                          id as fid,  
                          linename,  
                          pipetype, 
                          ppmaterial, 
                          size, 
                          class, 
                          arezone, 
                          funded, 
                          "Length(m)",
                          CASE WHEN year_of_in = 0 THEN NULL ELSE year_of_in END as year_of_in
                      ) AS p
                    )) AS properties
                  FROM water_system.water_pipeline
                  WHERE NOT ST_IsEmpty(geom)
                ) AS feature
              ) AS featurecollection
            `
        },
        {
          name: 'sewerline',
          geojsonFileName: __dirname + '/sewerline.geojson',
          select: `
          SELECT row_to_json(featurecollection) AS json FROM (
              SELECT
                'FeatureCollection' AS type,
                array_to_json(array_agg(feature)) AS features
              FROM (
                SELECT
                  'Feature' AS type,
                  id,
                  ST_AsGeoJSON(ST_SetSRID(ST_MakeValid(geom),4326))::json AS geometry,
                  row_to_json((
                    SELECT t FROM (
                      SELECT
                        16 as maxzoom,
                        10 as minzoom
                    ) AS t
                  )) AS tippecanoe,
                  row_to_json((
                    SELECT p FROM (
                      SELECT
                        id as fid,  
                        size, 
                        material, 
                        type,
                        length
                    ) AS p
                  )) AS properties
                FROM sewer_system.sewer_line
                WHERE NOT ST_IsEmpty(geom)
              ) AS feature
            ) AS featurecollection
          `
      },
      {
        name: 'meter',
        geojsonFileName: __dirname + '/meter.geojson',
        select:`
        SELECT row_to_json(featurecollection) AS json FROM (
          SELECT
            'FeatureCollection' AS type,
            array_to_json(array_agg(feature)) AS features
          FROM (
            SELECT
            'Feature' AS type,
            id,
            ST_AsGeoJSON(ST_SetSRID(geom,4326))::json AS geometry,
            row_to_json((
              SELECT t FROM (
                SELECT
                  16 as maxzoom,
                  16 as minzoom
              ) AS t
            )) AS tippecanoe,
            row_to_json((
              SELECT p FROM (
                SELECT
                  id as fid, 
                  cast(accountno as integer) as accountno, 
                  custname, 
                  plot_no, 
                  category, 
                  zoneid, 
                  sewered, 
                  connection as connection_date, 
                  old_connec as old_connection, 
                  serialno
              ) AS p
            )) AS properties
            FROM water_system.customer_meters
            WHERE NOT ST_IsEmpty(geom)
          ) AS feature
        ) AS featurecollection
        `
      },
      {
        name: 'kiosks',
        geojsonFileName: __dirname + '/kiosks.geojson',
        select:`
        SELECT row_to_json(featurecollection) AS json FROM (
          SELECT
            'FeatureCollection' AS type,
            array_to_json(array_agg(feature)) AS features
          FROM (
            SELECT
            'Feature' AS type,
            id,
            ST_AsGeoJSON(ST_SetSRID(geom,4326))::json AS geometry,
            row_to_json((
              SELECT t FROM (
                SELECT
                  16 as maxzoom,
                  12 as minzoom
              ) AS t
            )) AS tippecanoe,
            row_to_json((
              SELECT p FROM (
                SELECT
                  id as fid, 
                  "nmae" as name
              ) AS p
            )) AS properties
            FROM water_system.water_kiosks
            WHERE NOT ST_IsEmpty(geom)
          ) AS feature
        ) AS featurecollection
        `
      },
      {
        name: 'borehole',
        geojsonFileName: __dirname + '/borehole.geojson',
        select:`
        SELECT row_to_json(featurecollection) AS json FROM (
          SELECT
            'FeatureCollection' AS type,
            array_to_json(array_agg(feature)) AS features
          FROM (
            SELECT
            'Feature' AS type,
            id,
            ST_AsGeoJSON(ST_SetSRID(geom,4326))::json AS geometry,
            row_to_json((
              SELECT t FROM (
                SELECT
                  16 as maxzoom,
                  12 as minzoom
              ) AS t
            )) AS tippecanoe,
            row_to_json((
              SELECT p FROM (
                SELECT
                  id as fid, 
                  bh_name, 
                  "yld(m3/h)", 
                  supp_sz, 
                  pump_yld, 
                  pwr_src
              ) AS p
            )) AS properties
            FROM water_system."Boreholes"
            WHERE NOT ST_IsEmpty(geom)
          ) AS feature
        ) AS featurecollection
        `
      },
      {
        name: 'tank',
        geojsonFileName: __dirname + '/tank.geojson',
        select:`
        SELECT row_to_json(featurecollection) AS json FROM (
          SELECT
            'FeatureCollection' AS type,
            array_to_json(array_agg(feature)) AS features
          FROM (
            SELECT
            'Feature' AS type,
            id,
            ST_AsGeoJSON(ST_SetSRID(geom,4326))::json AS geometry,
            row_to_json((
              SELECT t FROM (
                SELECT
                  16 as maxzoom,
                  12 as minzoom
              ) AS t
            )) AS tippecanoe,
            row_to_json((
              SELECT p FROM (
                SELECT
                  id as fid, 
                  capacity, 
                  area_suppl, 
                  name, 
                  enabled, 
                  ancillaryr
              ) AS p
            )) AS properties
            FROM water_system.storage_tanks
            WHERE NOT ST_IsEmpty(geom)
          ) AS feature
        ) AS featurecollection
        `
      },
      {
        name: 'booster_pump',
        geojsonFileName: __dirname + '/booster_pump.geojson',
        select:`
        SELECT row_to_json(featurecollection) AS json FROM (
          SELECT
            'FeatureCollection' AS type,
            array_to_json(array_agg(feature)) AS features
          FROM (
            SELECT
            'Feature' AS type,
            id,
            ST_AsGeoJSON(ST_SetSRID(geom,4326))::json AS geometry,
            row_to_json((
              SELECT t FROM (
                SELECT
                  16 as maxzoom,
                  12 as minzoom
              ) AS t
            )) AS tippecanoe,
            row_to_json((
              SELECT p FROM (
                SELECT
                  id as fid, 
                  "NAME" as name, 
                  motorsize,
                  p_head, 
                  flow_rate, 
                  model, 
                  inlet_dia, 
                  outlet_dia
              ) AS p
            )) AS properties
            FROM water_system."BOOSTER_PUMP"
            WHERE NOT ST_IsEmpty(geom)
          ) AS feature
        ) AS featurecollection
        `
      },
      {
        name: 'chambers',
        geojsonFileName: __dirname + '/chambers.geojson',
        select:`
        SELECT row_to_json(featurecollection) AS json FROM (
          SELECT
            'FeatureCollection' AS type,
            array_to_json(array_agg(feature)) AS features
          FROM (
            SELECT
            'Feature' AS type,
            id,
            ST_AsGeoJSON(ST_SetSRID(geom,4326))::json AS geometry,
            row_to_json((
              SELECT t FROM (
                SELECT
                  16 as maxzoom,
                  14 as minzoom
              ) AS t
            )) AS tippecanoe,
            row_to_json((
              SELECT p FROM (
                SELECT
                  id as fid, 
                  name, 
                  category, 
                  date, 
                  comments, 
                  photo
              ) AS p
            )) AS properties
            FROM water_system.chambers
            WHERE NOT ST_IsEmpty(geom)
          ) AS feature
        ) AS featurecollection
        `
      },
      // {
      //   name: 'manholes',
      //   geojsonFileName: __dirname + '/manholes.geojson',
      //   select:`
      //   SELECT row_to_json(featurecollection) AS json FROM (
      //     SELECT
      //       'FeatureCollection' AS type,
      //       array_to_json(array_agg(feature)) AS features
      //     FROM (
      //       SELECT
      //       'Feature' AS type,
      //       ST_AsGeoJSON(ST_SetSRID(geom,4326))::json AS geometry,
      //       row_to_json((
      //         SELECT t FROM (
      //           SELECT
      //             16 as maxzoom,
      //             14 as minzoom
      //         ) AS t
      //       )) AS tippecanoe,
      //       row_to_json((
      //         SELECT p FROM (
      //           SELECT
      //             id as fid, 
      //             makemteria, 
      //             depth
      //         ) AS p
      //       )) AS properties
      //       FROM sewer_system.manholes_2020
      //       WHERE NOT ST_IsEmpty(geom)
      //     ) AS feature
      //   ) AS featurecollection
      //   `
      // },
      {
        name: 't_wrks',
        geojsonFileName: __dirname + '/t_wrks.geojson',
        select:`
        SELECT row_to_json(featurecollection) AS json FROM (
          SELECT
            'FeatureCollection' AS type,
            array_to_json(array_agg(feature)) AS features
          FROM (
            SELECT
            'Feature' AS type,
            id,
            ST_AsGeoJSON(ST_SetSRID(geom,4326))::json AS geometry,
            row_to_json((
              SELECT t FROM (
                SELECT
                  16 as maxzoom,
                  12 as minzoom
              ) AS t
            )) AS tippecanoe,
            row_to_json((
              SELECT p FROM (
              SELECT
                id as fid,
                type
              ) AS p
            )) AS properties
            FROM water_system.t_works
            WHERE NOT ST_IsEmpty(geom)
          ) AS feature
        ) AS featurecollection
        `
      },
      {
        name: 'blocks',
        geojsonFileName: __dirname + '/blocks.geojson',
        select:`
        SELECT row_to_json(featurecollection) AS json FROM (
          SELECT
            'FeatureCollection' AS type,
            array_to_json(array_agg(feature)) AS features
          FROM (
            SELECT
            'Feature' AS type,
            id,
            ST_AsGeoJSON(ST_SetSRID(geom,4326))::json AS geometry,
            row_to_json((
              SELECT t FROM (
                SELECT
                  16 as maxzoom,
                  10 as minzoom
              ) AS t
            )) AS tippecanoe,
            row_to_json((
              SELECT p FROM (
              SELECT
                id as fid,
                block, 
                names
              ) AS p
            )) AS properties
            FROM public.supply_blocks
            WHERE NOT ST_IsEmpty(geom)
          ) AS feature
        ) AS featurecollection
        `
      },
      {
        name: 'blocks_annotation',
        geojsonFileName: __dirname + '/blocks_annotation.geojson',
        select:`
        SELECT row_to_json(featurecollection) AS json FROM (
          SELECT
            'FeatureCollection' AS type,
            array_to_json(array_agg(feature)) AS features
          FROM (
            SELECT
            'Feature' AS type,
            id,
            ST_AsGeoJSON(ST_SetSRID(ST_CENTROID(geom),4326))::json AS geometry,
            row_to_json((
              SELECT t FROM (
                SELECT
                  16 as maxzoom,
                  10 as minzoom
              ) AS t
            )) AS tippecanoe,
            row_to_json((
              SELECT p FROM (
              SELECT
                id as fid,
                block, 
                names
              ) AS p
            )) AS properties
            FROM public.supply_blocks
            WHERE NOT ST_IsEmpty(geom)
          ) AS feature
        ) AS featurecollection
        `
      },
      {
        name: 'cadastral',
        geojsonFileName: __dirname + '/cadastral.geojson',
        select:`
        SELECT row_to_json(featurecollection) AS json FROM (
          SELECT
            'FeatureCollection' AS type,
            array_to_json(array_agg(feature)) AS features
          FROM (
            SELECT
            'Feature' AS type,
            ST_AsGeoJSON(ST_SetSRID(geom,4326))::json AS geometry,
            row_to_json((
              SELECT t FROM (
                SELECT
                  16 as maxzoom,
                  15 as minzoom
              ) AS t
            )) AS tippecanoe,
            row_to_json((
              SELECT p FROM (
              SELECT
                id as fid,
                CASE WHEN plot_no = '0' THEN NULL WHEN plot_no IS NOT NULL THEN plot_no ELSE NULL END as plot_no,
                block_name
              ) AS p
            )) AS properties
            FROM public.cadastral_nanyuki
            WHERE NOT ST_IsEmpty(geom)
          ) AS feature
        ) AS featurecollection
        `
      },
      {
        name: 'cadastral_annotation',
        geojsonFileName: __dirname + '/cadastral_annotation.geojson',
        select:`
        SELECT row_to_json(featurecollection) AS json FROM (
          SELECT
            'FeatureCollection' AS type,
            array_to_json(array_agg(feature)) AS features
          FROM (
            SELECT
            'Feature' AS type,
            ST_AsGeoJSON(ST_SetSRID(ST_CENTROID(geom),4326))::json AS geometry,
            row_to_json((
              SELECT t FROM (
                SELECT
                  16 as maxzoom,
                  16 as minzoom
              ) AS t
            )) AS tippecanoe,
            row_to_json((
              SELECT p FROM (
              SELECT
                id as fid,
                CASE WHEN plot_no = '0' THEN NULL WHEN plot_no IS NOT NULL THEN plot_no ELSE NULL END as plot_no,
                block_name
              ) AS p
            )) AS properties
            FROM public.cadastral_nanyuki
            WHERE NOT ST_IsEmpty(geom)
          ) AS feature
        ) AS featurecollection
        `
      },
    ],
};
