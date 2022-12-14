const { Schema, model } = require('mongoose');

const ticketSchema = new Schema({
    userid: String,
    category: String,
    description: String,
    name: String,
    email: String,
    phone: String,
    state: String,
    answer: String
}, {
    timestamps: true
})

module.exports = model('Ticket', ticketSchema);