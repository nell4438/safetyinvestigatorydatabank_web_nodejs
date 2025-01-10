const dotenv = require('dotenv')


dotenv.config()

    const conn = {
        user: process.env.USER,
        password: process.env.PASS,
        server: process.env.HRD_SERVER,
        database: process.env.GRP_JAP_ADVISER_DATABASE,
        options: {
            encrypt: false,
            enableArithAbort: true
        },
    }

module.exports = conn