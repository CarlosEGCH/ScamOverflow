const { Schema, model } = require("mongoose");

const userSchema = new Schema({
    name: String,
    phone: String,
    email: String,
    password: String,
    role: String,
    occupation: String
}, {
    timestamps: true
});

module.exports = model("User", userSchema);