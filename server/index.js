const express = require('express')
require('dotenv').config()
const dbCofig = require('./config/dbConfig')
const cors = require('cors')


const app = express()
app.use(express.json())
app.use(cors())

const UserModel = require('./models/Users')
const userRoutes = require('./routes/userRoutes')
const songsRoutes = require('./routes/songsRoutes')
const adminRoutes = require('./routes/adminRoutes')
app.use('/api/users', userRoutes)
app.use('/api/songs', songsRoutes)
app.use('/api/admin', adminRoutes)




app.listen(3001, () => {
    console.log("server is running")
})