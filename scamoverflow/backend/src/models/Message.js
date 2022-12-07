const { Schema, model } = require('mongoose');

/**
 * When a message is transformed into a ticket,
 * the app gives the option to choose a title
 * for the question, since the category is 
 * already defined.
 */

const messageSchema = new Schema({
    room: String,
    author: String,
    message: String,
    image: String,
    isImage: Boolean
},{
    timestamps: true
})

module.exports = model('Message', messageSchema);