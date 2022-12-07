const { Schema, model } = require("mongoose");

const userSchema = new Schema({
    name: String,
    studentId: String,
    description: String,
    phone: String,
    email: String,
    password: String,
    role: String,
    image: String,
    categories: [String],
}, {
    timestamps: true
});

module.exports = model("User", userSchema);