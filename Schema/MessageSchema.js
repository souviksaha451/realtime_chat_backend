const { Schema, model} = require("mongoose");
const mongoose = require("mongoose");

const MessageSchema = new Schema({
    message: {
        type: String,
        required: false
    },
    room_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Room",
        required: false
    },
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: false
    },
    created_at: {
        type: Date,
        default: Date.now(),
        required: false
    }
})

const message = model("Message", MessageSchema)
module.exports = message;