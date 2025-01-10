
const express = require('express')
const cors = require('cors')
const bodyparser = require('body-parser')
const helmet = require('helmet')
const router = require('./routes/controller.js')

const app = express()
const port = process.env.PORT || 6061

app.use(cors())
// app.use(bodyparser.urlencoded({ extended: false }))
// app.use(bodyparser.json())

app.use(express.json({ limit: '999mb' }));

app.use(express.urlencoded({ limit: '999mb', extended: true }));

app.use(helmet())
app.listen(port, function () {
	console.log('listening to port ' + port);
})

app.use('/api', router)
