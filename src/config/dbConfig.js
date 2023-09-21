const { Pool } = require('pg');

const dblocal = new Pool({
    user: process.env.AWS_PGUSER,
    host: process.env.AWS_PGHOST,
    database: process.env.AWS_PGDATABASE,
    password: process.env.AWS_PGPASSWORD,
    port: process.env.AWS_PGPORT
})
dblocal.connect().then(()=>console.log('Conexión  DB'));


module.exports = { dblocal };