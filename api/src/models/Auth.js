const mongoose = require('mongoose')
const { Schema } = mongoose

const AuthSchema = new Schema({
    username: {type: String, required: true},
    pin: {type: String, required: true}
})

module.exports = mongoose.model('Auth', AuthSchema)