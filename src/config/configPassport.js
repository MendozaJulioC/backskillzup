const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');
const { dblocal } = require('./dbConfig');
const JWT = require('jsonwebtoken');

passport.use(new LocalStrategy({
    usernameField: 'usermail',
    passwordField: 'password'
    }, async (usermail, password, donde)=>{
        let user=[];
        //aqui colocar la consulta para validar el email
        const respuesta = await dblocal.query(`select id_user, email, nom_user, password, rol from auth.tbl_usuarios where email=$1`, [usermail])
        // validar la respuesta
        if(respuesta.rows.length>0){
            user = respuesta.rows
            isEmail(usermail,password, user, done)
        }else{
            return done(null, false, {message : "Usuario no registrado"})
        }
    }
))

passport.serializeUser((user, done)=> {
    done(null, user[0].id_user)
})
passport.deserializeUser((id_user,done)=>{
    finalFunction(id_user, done)
})

async function isEmail(usermail, pass, user, done){
    if(usermail== user[0].email){
        isMatch(pass, user, done)
    }else{
        return donde(null, false, {message: "Usuario no registrado"})
    }
}

async function isMatch(password, user, donde){
    try {
        const match = await bcrypt.compare(password, user[0].password)
      if(match){
        return done(null,user,{message: user[0].nom_usuario });
      }else{
        return done(null, user, {message: "Datos de inicio de session errados!!!"})
      }
    } catch (error) {
        console.error('Error autenticación', error);
    }
}

async function finalFunction(id_user, done){
    try {
    
        const response = await dblocal.query(` select id_user, email, nom_user, cedula, celular, rol from auth.tbl_users where id=$1`, [id]);
        const token = await JWT.sign({id }, process.env.KEYSECRET,{expiresIn: 7200000})
     
       
        if(response.rows.length>0){
            return done(null, response.rows, token)
        } else{
            
            return done(null, false, { message: 'Datos de inicio de session Errados  !!!'}  )   
        }
      } catch (error) {
        console.error('Error de autenticación: ', error);
      }
}