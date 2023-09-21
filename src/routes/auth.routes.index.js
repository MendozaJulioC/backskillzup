const { Router } = require('express');
const router = Router();
const passport = require('passport');
const { postLoguin } = require('../controllers/auth.controllers');
require('../config/configPassport')

const authCtrl = require('../controllers/auth.controllers');
const authRegisterCtrl = require('../controllers/register.controllers')
const { isAuthenticated, Auth, notAuthenticated } = require('../helpers/auth')

router.get('/', authCtrl.getHome)
router.get('/api/auth/validate/email/:email', authCtrl.getEmail)
      .get('/api/auth/validate/id/:id_user', authCtrl.getIdCtrl)
      .post('/api/auth/login', authCtrl.login)
      .post('/api/login/validate', authCtrl.login )

      //.get('/api/auth/protected',authCtrl.getShield)
      .get('/api/auth/logout', authCtrl.logout)
      .post('/api/auth/checkAuth', Auth)

      //route para resgistrar usuarios
router.post('/api/auth/register/', authRegisterCtrl.authRegister)
      .post('/api/auth/regsiter/lider', authRegisterCtrl.authRegisterLider)
      .post('/api/auht/register/coordinador',authRegisterCtrl.authRegisterCoordinador)


router.post('/api/auth/creo/register', authRegisterCtrl.authRegisterCreo)
      .get('/api/auth/creo/validate/email/:email', authCtrl.getEmailCreo)      

module.exports= router