const { Schema, model } = require("mongoose");

const postSchema = new Schema({
    userId: String,
    name: String,
    occupation: String,
    title: String,
    description: String,
    image: String,
    comments: Array //userid, user name, comment 
}, {
    timestamps: true
});

module.exports = model("Post", postSchema);