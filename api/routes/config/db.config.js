const dotenv = require('dotenv')


dotenv.config()


    const conn = {
        user: process.env.USER,
        password: process.env.PASS,
        server: process.env.SERVER,
        database: process.env.GRP_DATABASE,
        options: {
            enableArithAbort: true
        },
    }



module.exports = conn