const mongoose = require('mongoose')
const { Schema } = mongoose

const InfoSchema = new Schema({
    peopleEntering: {type: Number, isRequired: true},
    peopleInside: {type: Number, isRequired: true},
    storePin: {type: String, isRequired: true},
    timestamp: {type: Date, isRequired: true},
})

module.exports = mongoose.model("Info", InfoSchema)