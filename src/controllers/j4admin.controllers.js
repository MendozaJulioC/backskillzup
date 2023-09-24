const XLSX = require('xlsx');
const { dblocal } = require('../config/dbConfig');


const j4adminCtrl = {};

j4adminCtrl.getPtoVotacion = async(req, res)=>{
    try {
        const excel = XLSX.readFile('src/public/maestro_pto_vot.xlsx');
        var nombreHoja = excel.SheetNames;
        var datos = XLSX.utils.sheet_to_json(excel.Sheets[nombreHoja[0]])
        console.log(datos)

        // for (let i = 0; i < datos.length; i++) {
        // await dblocal.query(` 
        //     INSERT INTO col_electoral.tbl_puestos_votacion(
        //     codcol, nom_pto_vot, codcomuna, codbarrio, direccion, tot_potencial_hombres, tot_potencial_mujeres, tot_potenciales, lon, lat, num_mesas)
        //     VALUES (
        //        '${datos[i].codcol}',
        //        '${datos[i].nom_pto_votacion}',
        //         '${datos[i].codcomu}',
        //         '${datos[i].codbarrio}',
        //         '${datos[i].direccion}',
        //         ${datos[i].Total_Hombres},
        //         ${datos[i].Total_Mujeres},    
        //         ${datos[i].Total_Potenciales},
        //         ${datos[i].lon},
        //         ${datos[i].lat},
        //         ${datos[i].num_mesas}
        //     );
        // `);
        //      console.log(datos[i].codcol, " -ok");
        //  }
         res.status(200).json({message: 'Ok'})

    } catch (error) {
        console.error('Error getPtoVotacion', error);
    }
}

j4adminCtrl.getHistoryVotacion = async (req, res)=>{
    try {
        const excel = XLSX.readFile('src/public/maestro_pto_vot.xlsx');
        var nombreHoja = excel.SheetNames;
        var datos = XLSX.utils.sheet_to_json(excel.Sheets[nombreHoja[1]])
        console.log(datos)
        // for (let i = 0; i < datos.length; i++) {
        //     await dblocal.query(` 
        //         INSERT INTO col_electoral.tbl_history_votacion(
        //         codcol, codcorporacion, corporacion, vigecnia, candidato, partido, tot_votos)
        //         VALUES (
        //             '${datos[i].codcol}',
        //             ${datos[i].codcoporacion},
        //             '${datos[i].corporacion}',
        //             ${datos[i].Fecha},
        //             '${datos[i].Candidato}',
        //             '${datos[i].partido}',
        //             ${datos[i].total_votos}  
        //         );
        // `);
        //      console.log(datos[i].codcol, " -ok");
        //  }
        res.status(200).json({message: 'Ok'})
    } catch (error) {
        console.error('error getHistoryVotacion', error);
    }
}

j4adminCtrl.getLiderBarriosGIS = async(req, res)=>{
    try {

         const response = await dblocal.query(
         `  SELECT jsonb_build_object(
                'type', 'FeatureCollection',
                'features', jsonb_agg(features.feature)
                )
                FROM(
                select jsonb_build_object(
                    'type',	'Feature',
                    'id',	cod_barrio,
                    'geometry',	ST_AsGeoJSON(geom)::jsonb,
                    'properties',	json_build_object(
                        'CODBARRIO', cod_barrio,
                        'NOMBRE', nombre,
                        'NOMLIDER', nom_lider,
                        'CELULAR', celular,
                        'EMAIL', email
                    )
                )AS feature FROM (	select 
                    nom_lider,
                    celular,
                    email,
                    estado.tbl_lider_barrio.cedula,
                    cod_barrio, 
                    nombre,
                    geom
                    from estado.auth_lider_territorio
                    inner join estado.tbl_lider_barrio on estado.tbl_lider_barrio.cedula = estado.auth_lider_territorio.cedula
                    inner join territorio.tbl_barrios on territorio.tbl_barrios.codbarrio = estado.tbl_lider_barrio.cod_barrio )
                inputs) features;`) 
                res.status(200).json({data: response.rows})
        
    } catch (error) {
        console.error('Error getIPEXterritoriovigencias ');
    }
}

j4adminCtrl.getTotalVotosFecha = async (req, res) => {
  try {
    const response = await dblocal.query(` 
        select vigecnia ,sum(tot_votos) as votos  from col_electoral.tbl_history_votacion group by vigecnia order by vigecnia
    `);
    res.status(200).json({ data: response.rows });
  } catch (error) {
    console.error("Error getTotalVotosFecha", error);
  }
};

j4adminCtrl.getParticipacionElectoral = async (req, res)=>{
    try {
        const response = await dblocal.query(`select 
        vigecnia,
        (sum(tot_votos)/(select sum(tot_potenciales) as participacion  from col_electoral.tbl_puestos_votacion)) as participacion
    from col_electoral.tbl_history_votacion 
    group by vigecnia
    order by vigecnia`)
    res.status(200).json({ data: response.rows });

    } catch (error) {
        console.error('Error getParticipacionElectoral', error);
    }
}

j4adminCtrl.getPontecialVotosporSex = async(req, res)=>{
    try {
        const response = await dblocal.query(`
        select sum(tot_potencial_hombres) as hombres, sum(tot_potencial_mujeres) as mujeres from col_electoral.tbl_puestos_votacion
        `)
        res.status(200).json({ data: response.rows });
    } catch (error) {
        console.error('Error getPontecialVotosporSex ', error);
    }
}

j4adminCtrl.getResultadosFechas = async (req, res)=>{
    try {
        const year = req.params.vigecnia
        const response = await dblocal.query(` 
        select 
            vigecnia, candidato ,sum(tot_votos) as votos 
        from col_electoral.tbl_history_votacion
        where vigecnia = $1
        group by vigecnia, candidato 
        order by  vigecnia, votos DESC`,[year])
        res.status(200).json({ data: response.rows });
    } catch (error) {
        console.error('Error getResultadosFechas', error);
    }
}

j4adminCtrl.getLideresRegistrados = async(req, res)=>{
    try {
        const response = await dblocal.query(`         
            select 
                estado.tbl_lider_barrio.cedula, 
                nom_lider,
                email,
                celular,
                direccion,
                codbarrio,
                nombre,
                codcomuna,
                nombre_com
            from estado.tbl_lider_barrio
            inner join territorio.tbl_barrios on territorio.tbl_barrios.codbarrio = estado.tbl_lider_barrio.cod_barrio
            inner join estado.auth_lider_territorio on estado.auth_lider_territorio.cedula = estado.tbl_lider_barrio.cedula
        `)
        res.status(200).json({data: response.rows})

    } catch (error) {
        console.error('Error getLideresRegistrados', error);
    }
}

j4adminCtrl.getListadoBarrioLider = async(req, res)=>{
    try {
        const cedulalider = req.params.cedula
        const respuesta = await dblocal.query(` 
        select 
	        estado.tbl_lider_barrio.cedula, 
	        codbarrio,
	        nombre,
	        codcomuna,
	        nombre_com
        from estado.tbl_lider_barrio
        inner join territorio.tbl_barrios on territorio.tbl_barrios.codbarrio = estado.tbl_lider_barrio.cod_barrio
        inner join estado.auth_lider_territorio on estado.auth_lider_territorio.cedula = estado.tbl_lider_barrio.cedula
        where estado.tbl_lider_barrio.cedula = $1
        `, [cedulalider])
        res.status(200).json({data: respuesta.rows})
    } catch (error) {
        console.error('Error getListadoBarrioLider ', error);
    }
}

j4adminCtrl.deleteLiderBarrio = async(req, res)=>{
    try {
        const cedulalider = req.params.cedula;
        const response = await dblocal.query(` 
        delete from estado.tbl_lider_barrio where cedula =$1
        `, [cedulalider])
      
        const response2 = await dblocal.query(`
        delete from estado.auth_lider_territorio where cedula = $1 RETURNING *;
        `, [cedulalider])
        res.status(200).json({data: response2.rows})
        
    } catch (error) {
        console.error('Error deleteLiderBarrio', error);
    }
}

j4adminCtrl.getCedulaValidated = async(req, res)=>{
    try {
        const iduser = req.params.cedula;
        const response = await dblocal.query(`
        select
        cedula, nom_lider 
        from estado.auth_lider_territorio 
        where cedula = $1`,[iduser]);
        res.status(200).json({data: response.rows})
        
    } catch (error) {
        console.error('Error getCedulaValidated', error);
    }
}

j4adminCtrl.getCoberturaLiderBarrial = async (req, res)=>{
    try {
        const response = await dblocal.query(` 
            select * from estado.porcentajecoberturaterritorial()
        `)
        res.status(200).json({data: response.rows})
    } catch (error) {
        console.error('Error getCoberturaLiderBarrial');
    }
}

j4adminCtrl.getCuantosLideres = async(req, res)=>{
    try {
        const response = await dblocal.query('select count(cedula) from estado.auth_lider_territorio')
        res.status(200).json({data: response.rows})

    } catch (error) {
        console.error('Error getCuantosLideres ', error);
    }
}


j4adminCtrl.getCoberturaComunaLideresGIS = async (req, res)=>{
    
    try {
        const response = await dblocal.query(
            `SELECT jsonb_build_object(
                'type', 'FeatureCollection',
                'features', jsonb_agg(features.feature)
                )
                FROM(
                select jsonb_build_object(
                    'type',	'Feature',
                    'id',	codcomuna,
                    'geometry',	ST_AsGeoJSON(geom)::jsonb,
                    'properties',	json_build_object(
                        'CODCOMUNA', codcomuna,
                        'NOMBRE', nombre,
                        'LIDERES', lideres
                      
                    )
                )AS feature FROM (	
					select 
						
						territorio.tbl_comunas.codcomuna, 
						territorio.tbl_comunas.nombre,
						count(territorio.tbl_comunas.codcomuna) as lideres,
					territorio.tbl_comunas.geom
					from estado.tbl_lider_barrio
					inner join territorio.tbl_barrios on territorio.tbl_barrios.codbarrio = estado.tbl_lider_barrio.cod_barrio
					inner join territorio.tbl_comunas on territorio.tbl_comunas.codcomuna =territorio.tbl_barrios.codcomuna
					group by 
						territorio.tbl_comunas.codcomuna, 
						territorio.tbl_comunas.nombre
				)inputs) features;
            `

        )
        res.status(200).json({data: response.rows})
        
    } catch (error) {
        console.error('Error getCoberturaComunaLideresGIS ', error);
    }

}


j4adminCtrl.getCoordinadorGIS = async(req, res)=>{
    try {
        const response = await dblocal.query(
          `  
                SELECT jsonb_build_object(
                    'type', 'FeatureCollection',
                    'features', jsonb_agg(features.feature)
                )
                FROM(
                    select jsonb_build_object(
                        'type',	'Feature',
                        'id',	codcomuna,
                        'geometry',	ST_AsGeoJSON(geom)::jsonb,
                        'properties',	json_build_object(
                        'CODCOMUNA', codcomuna,
                        'NOMBRE', nombre,
                        'NOMLIDER', nom_lider,
                        'CELULAR', celular,
                        'EMAIL', email
                    )
                )AS feature FROM (
                    select 
                        nom_lider,
                        estado.auth_coordinador_territorio.cedula,
                        email,
                        celular,
                        estado.tbl_coordinador_comuna.codcomuna,
                        territorio.tbl_comunas.nombre,
                        geom
                    from estado.auth_coordinador_territorio
                    join estado.tbl_coordinador_comuna on estado.tbl_coordinador_comuna.cedula = estado.auth_coordinador_territorio.cedula
                    join territorio.tbl_comunas on territorio.tbl_comunas.codcomuna = estado.tbl_coordinador_comuna.codcomuna
                )inputs) features;
            `
        );
        res.status(200).json({data: response.rows})
        
    } catch (error) {
        console.error('Error getCoordinadorGIS ', error);
    }
}

module.exports = j4adminCtrl;