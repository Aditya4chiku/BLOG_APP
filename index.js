const express = require('express')
const app = express();
const mongoose = require('mongoose')
const PORT = 3000;
const user = require('./routes/user')
//DB connection
const url = "mongodb://localhost:27017/BLOG"
const Profile = require('./routes/profile')
const cors = require('cors')

mongoose.connect(url, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true

})


app.use(cors())
app.use(express.json())
app.use('/', user)
app.use('/', Profile)

app.get('/', (req, res) => {
    res.send("From Index file")
})

app.listen(PORT, () => {
    console.log(`Server ir running on ${PORT} `)
})
