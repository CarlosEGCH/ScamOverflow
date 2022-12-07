require('dotenv').config()

const mongoose = require("mongoose");

mongoose.connect(process.env.BASE_URL,{
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(db => console.log("Database is connected"))
.catch(err => console.log("Server error: " + err))