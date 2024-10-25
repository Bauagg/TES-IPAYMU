const mongoose = require('mongoose')
require('dotenv').config()

mongoose.connect(`${process.env.MONGO_URL}`)

const db = mongoose.connection

db.on('error', console.log.bind(console, 'databases connection error'))
db.on('open', () => console.log('databases connection success'))