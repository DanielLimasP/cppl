const express = require('express')
const bodyParser = require('body-parser')

const app = express()
require('./database')

// Settings
app.set('port', process.env.PORT || 4000)

// Middlewares
app.use(bodyParser.urlencoded({extended:false}))
app.use(bodyParser.json())

// Routes
const auth = require('./src/routes/auth-routes')
app.use('/auth', auth)
const info = require('./src/routes/info-routes')
app.use('/info', info)

module.exports = app

// Server init
app.listen(app.get('port'), ()=>{
    console.log('Server on port: ', app.get('port'))
})
