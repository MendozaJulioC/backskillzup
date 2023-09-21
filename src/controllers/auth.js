const JWT = require('jsonwebtoken');
const helpers = {};

helpers.isAuthenticated = async (req, res, next)=>{
    if(req.isAuthenticated()){
        return next();
    }else{
        res.status(200).json({
            Autor: 'j4data.info',
            Open: false
        })
    }
}

helpers.notAuthenticated =async (req,res,next)=>{
    if (req.isAuthenticated()) {
        res.status(200).json({
            Autor: 'j4data.info',
          Open: true
      })
    }
    return next();
}

helpers.Auth = async(req,res)=>{
    const token = req.body.token
    if (token) {
      const decode = JWT.verify(token, process.env.KEYSECRET);
      res.json({
        login: true,
        data: decode
      })
    }else{
      res.json({
        login: false,
        data: error
      })
    }
}
  
module.exports = helpers;