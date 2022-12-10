const { Schema, model } = require("mongoose");

const commentSchema = new Schema({
    postId: String,
    name: String,
    comment: String,
    misinformation: Number,
    badlanguage: Number,
    spam: Number
}, {
    timestamps: true
});

module.exports = model("Comment", commentSchema);