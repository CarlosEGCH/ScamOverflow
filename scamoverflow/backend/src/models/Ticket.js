const { Schema, model } = require('mongoose');

const ticketSchema = new Schema({
    category: String,
    description: String,
    name: String,
    email: String,
    phone: String,
    state: String
}, {
    timestamps: true
})

module.exports = model('Ticket', ticketSchema);