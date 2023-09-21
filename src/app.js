const express = require('express');
const cors = require('cors');
const path = require('path');
const session = require('express-session')
const pgSession = require('connect-pg-simple')(session);
const {dblocal} = require('./config/dbConfig') 
const flash = require('connect-flash');
const passport = require('passport')

require('./config/configPassport');

const app = express()
app.use(express.json())
app.use(express.urlencoded({extended: false}));
app.use(cors())

app.use(session({
    store: new pgSession({
        pool: dblocal, //conecction pool
        tableName: process.env.TBL,
        schemaName: process.env.SCHEMA_SESSION
    }),
    secret: process.env.KEY_SESSION,
    resave: false,
    saveUninitialized: true,
    cookie:{maxAge: 720000}
}));

app.use(passport.initialize())
app.use(passport.session())
app.use(flash())

app.use((req, res, next )=>{
    res.locals.message= req.flash('message');
    res.locals.error = req.flash('error');
    res.locals.user= req.user || null;
    console.log(res.locals.error);
    next();
})

app.use(express.static(path.join(__dirname, 'public')));

module.exports = app;
 