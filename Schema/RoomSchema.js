const { Schema, model } = require("mongoose");
const { UserSchema } = require("./UserSchema");

const RoomSchema = new Schema({
    room_name: {
        type: String,
        required: false
    },
    room_description: {
        type: String,
        required: false
    },
    participants: {
        type: [UserSchema],
        required: false
    },
    admin: {
        type: [UserSchema],
        required: false
    },
    created_at: {
        type: Date,
        default: Date.now(),
        required: false
    }
})

const room = model("Room", RoomSchema);
module.exports = room;