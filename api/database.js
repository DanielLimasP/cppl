// Mongodb connection file
const mongoose = require('mongoose')
const url = 'mongodb://localhost/aidb'
const atlas = 'mongodb+srv://contavid_123:123@contavid.0nrw0.mongodb.net/<dbname>?retryWrites=true&w=majority'

mongoose.connect(atlas, {
    useCreateIndex: true,
    useNewUrlParser: true,
    useFindAndModify: false,
    useUnifiedTopology: true
}).then(db => console.log('Connection to Atlas established'))
.catch(err => console.log(err))