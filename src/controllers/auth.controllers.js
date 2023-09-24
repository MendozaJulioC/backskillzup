const {dblocal} = require('../config/dbConfig')
const bcrypt = require('bcryptjs');
const JWT = require('jsonwebtoken');
const passport = require('passport')
const { serialize } = require ('cookie')


const authCtrl={};

authCtrl.getHome= async(req, res)=>{
    res.send(`
    <!doctype html>
    <html lang="en">
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <title>Service Auth</title>
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.2.1/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-iYQeCzEYFbKjA/T2uDLTpkwGzCiq6soy8tYaI1GyVh/UjpbCx/TYkiZhlZB6+fzT" crossorigin="anonymous">
      </head>
      <body>
        <div id="carouselExampleInterval" class="carousel slide" data-bs-ride="carousel">
        <div class="carousel-inner">
          <div class="carousel-item active" data-bs-interval="3000">
            <img src="https://www.medellin.gov.co/es/wp-content/uploads/2022/08/biodiversidad-y-entretenimiento.jpg" class="d-block w-100" alt="...">
            <div class="carousel-caption d-none d-md-block">
            <h5>Service Auth </h5>
            <p>Microservicio Autorización y control de sessiones de la DataJazz</p>
          </div>
            </div>
          <div class="carousel-item" data-bs-interval="3000">
            <img src="https://www.medellin.gov.co/es/wp-content/uploads/2022/04/panoramica-nocturna-de-ciudad.jpg" class="d-block w-100" alt="...">
            <div class="carousel-caption d-none d-md-block">
            <h5>Service Plan Indicativo</h5>
            <p>Microservicio Plan Indicativo Distrtito Medellín</p>
          </div>
            </div>
          <div class="carousel-item" data-bs-interval="3000">
            <img src="https://www.medellin.gov.co/es/wp-content/uploads/2021/11/panoramica-nocturna-medellin.jpg" class="d-block w-100" alt="...">
            <div class="carousel-caption d-none d-md-block">
            <h5>Service Plan Indicativo</h5>
            <p>Microservicio Plan Indicativo Distrtito Medellín</p>
          </div>
            </div>
        </div>
        <button class="carousel-control-prev" type="button" data-bs-target="#carouselExampleInterval" data-bs-slide="prev">
          <span class="carousel-control-prev-icon" aria-hidden="true"></span>
          <span class="visually-hidden">Previous</span>
        </button>
        <button class="carousel-control-next" type="button" data-bs-target="#carouselExampleInterval" data-bs-slide="next">
          <span class="carousel-control-next-icon" aria-hidden="true"></span>
          <span class="visually-hidden">Next</span>
        </button>
      </div>
        <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.2.1/dist/js/bootstrap.bundle.min.js" integrity="sha384-u1OknCvxWvY5kfmNBILK2hRnQC3Pr17a+RTT6rIHI7NnikvbZlHgTPOOmMi466C8" crossorigin="anonymous"></script>
      </body>
    </html>


    `)
}

authCtrl.getEmail = async(req, res)=>{
  try {
    const email = req.params.email;
    const response = await dblocal.query(` select * from auth.tbl_usuarios where email=$1`, [email]);
    if(response.rows.length>0){res.status(200).json({data: response.rows, success: true}) }else{res.status(401).json({success: false})  }
  } catch (error) {
    console.error('Error getEmail: ', error);
    res.status(403).json({message: "Error consulta email ",error, success: false})
  }
}


// authCtrl.getEmailCreo = async(req, res)=>{
//   try {
//     const email = req.params.email;
//     const response = await dblocal.query(` select * from auth.tbl_usuarios_creo where email=$1`, [email]);
//     if(response.rows.length>0){res.status(200).json({data: response.rows, success: true}) }else{res.status(401).json({success: false})  }
//   } catch (error) {
//     console.error('Error getEmail: ', error);
//     res.status(403).json({message: "Error consulta email ",error, success: false})
//   }
// }

authCtrl.getIdCtrl = async(req, res)=>{
  try {
    const id_user = req.params.id_user;
    const response = await dblocal.query(` select email, nom_user, cedula, celular,  direccion, rol from auth.tbl_usuarios where id_user=$1`, [id_user]);
    if(response.rows.length>0){res.status(200).json({data: response.rows, success: true}) }else{res.status(401).json({success: false})  }
  } catch (error) {
    console.error('Error getIdCtrl: ', error);
    res.status(403).json({message: "Error consulta email ",error, success: false})
  }
}

// authCtrl.postLoguin = passport.authenticate('local',{
//   successRedirect:'/api/auth/protected',
// })

authCtrl.login = async(req, res)=>{
  try {
      const { email, password} = req.body
      const response = await dblocal.query(`select id_user, email, password from auth.tbl_usuarios where email=$1`, [email])
      if(!response.rows.length){
        return res.status(401).json({ success: false, message:"Error de credenciales!!!"})
      }
      const match = await bcrypt.compare(password, response.rows[0].password)
      if(!match){
        return res.status(401).json({ success: false, message:"Error de credenciales!!!"})
      }
      let id_user = response.rows[0].id_user
      let nom_user = response.rows[0].nom_user
      let cedula_user = response.rows[0].cedula
      let rol_user= response.rows[0].rol


      const finalquery = await dblocal.query(` select id_user, email, nom_user, cedula,  celular, direccion, rol from auth.tbl_usuarios where id_user=$1`, [id_user]);
      const token = await JWT.sign({ id_user:id_user, nom_user: nom_user,cedula_user: cedula_user, rol_user: rol_user , expiresIn:720000}  , process.env.KEYSECRET  ) 

    
       if(response.rows.length>0){
              
          res.status(200).json({
           success: true,
           data: finalquery.rows,
           token
          })
             authCtrl.PostLogin();

       } else{
        res.status(403).json({
          success: true,
          data: [],
          token: ''
         })
       }
      //tokenmaker(response.rows[0].id)
  } catch (error) {
    console.error('Error login: ', error);
    res.status(403).json({message: "Error login:  ",error, success: false})
  }
}
/*

authCtrl.getShield = async(req, res)=>{
  try {
      let user= req.user
      res.status(200).json({
            Autor: "j4data",
            user,
            login:true,
            token
      })

    } catch (error) {
        console.error('Error getShield: ', error);
        res.status(403).json({message: "Usuario  no registrado:  ", error})
    }
}
*/


authCtrl.logout = async(req, res)=>{
  console.log('Hemos salido')

  res.status(200).json({
    Autor: "j4data",
    exit:true
})
}

authCtrl.PostLogin=()=>{
  passport.authenticate('local',{
    successMessage: 'Perfecto',
    failureFlash: true
  })
}

module.exports = authCtrl;