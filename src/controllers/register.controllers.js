const { dblocal } = require('../config/dbConfig');
const bcrypt = require('bcryptjs');
const JWT = require('jsonwebtoken');
const authRegisterCtrl = {};

//insert user
authRegisterCtrl.authRegister = async (req, res)=>{
    try {
        const {cedula, nom_user, email, password, celular, direccion, rol}= req.body;
        let hashPass = await bcrypt.hash(password, 10)
        const response = await dblocal.query(`
        INSERT INTO auth.tbl_usuarios(
            cedula, nom_user, email, password, celular, direccion, rol)
                VALUES ($1, $2,$3, $4,$5, $6,$7 );`,
                [ cedula, nom_user, email,hashPass,celular,direccion, rol]);
        res.status(200).json({
            Autor: "j4data",
            message: "Usuario registado exitosamente",
            // data: response.rows
        })
    } catch (error) {
        console.error('Error authRegister: ', error);
        res.status(403).json({message: "Usuario no registrado:  ", error})
    }
}


// authRegisterCtrl.authRegisterCreo = async (req, res)=>{
//     try {
//         const {cedula, nom_user, email, password, celular, direccion, rol}= req.body;
//         let hashPass = await bcrypt.hash(password, 10)
//         const response = await dblocal.query(`
//         INSERT INTO auth.tbl_usuarios_creo(
//             cedula, nom_user, email, password, celular, direccion, rol)
//                 VALUES ($1, $2,$3, $4,$5, $6,$7 );`,
//                 [ cedula, nom_user, email,hashPass,celular,direccion, rol]);
//         res.status(200).json({
//             Autor: "j4data",
//             message: "Usuario registado exitosamente",
//             data: response.rows
//         })
//     } catch (error) {
//         console.error('Error authRegister: ', error);
//         res.status(403).json({message: "Usuario no registrado:  ", error})
//     }
// }

authRegisterCtrl.authRegisterLider = async(req, res)=>{
    try {
        const {cedula, nombre, email, pass,celular, adress, rol, org,tiporg, barrio} = req.body;
      
        let registerbarrio;
        const registerlider = await dblocal.query(` 
            INSERT INTO estado.auth_lider_territorio(
            cedula, nom_lider, email, pass, celular, direccion, rol, organizacion_lider, tipo_org)
            VALUES ($1, $2, $3, $4, $5,$6,$7,$8,$9) RETURNING nom_lider;`,
            [cedula, nombre, email, pass,celular, adress, rol, org,tiporg]
        )
        barrio.map(async function(element){
                registerbarrio = await dblocal.query(`INSERT INTO estado.tbl_lider_barrio(
                  cedula, cod_barrio)
                    VALUES ($1, $2);
                `, [cedula, element.value])
        })
        res.status(200).json({
            Autor: "j4KratiaAnalitik",
            data: registerlider.rows,
            message: "Usuario registado exitosamente"
        })

    } catch (error) {
        console.error('error authRegisterLider:', error);
    }
}

authRegisterCtrl.authRegisterCoordinador = async(req, res)=>{
    try {
    const { cedula, nombre, email, pass, celular,adress, rol,comuna}= req.body;
    let registercomuna;
    const resgistercoordinador = await dblocal.query(` 
       INSERT INTO estado.auth_coordinador_territorio(
            cedula, nom_lider, email, pass, celular, direccion, rol)
        VALUES ($1, $2, $3, $4, $5, $6, $7);
    `, [cedula,nombre,email,pass,celular,adress,rol]) 

    comuna.map(async function(element){
        registercomuna = await dblocal.query(`INSERT INTO estado.tbl_coordinador_comuna(cedula, codcomuna)VALUES ($1, $2);`,[cedula, element.value])
    })
    res.status(200).json({
        Autor: "j4KratiaAnalitik",
        data: resgistercoordinador.rows,
        message: "Usuario registado exitosamente"
    }) 
    } catch (error) {
        console.error('error authRegisterCoordinador:', error);
    }
  
}

module.exports = authRegisterCtrl 