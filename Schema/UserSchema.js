const { Schema, model } = require("mongoose");

const UserSchema = new Schema({
    firstName: {
        type: String,
        required: false
    },
    lastName: {
        type: String,
        required: false
    },
    email: {
        type: String,
        unique: true,
        required: false,
    },
    username: {
        type: String,
        unique: true,
        required: false
    },
    password: {
        type: String,
        required: false,
    },
    token: {
        type: String,
        required: false,
        default: null
    },
    otp: {
        type: String,
        required: false
    },
    account_active: {
        type: Boolean,
        required: false,
        default: false,
    },
    created_at: {
        type: Date,
        required: false,
        default: Date.now()
    }
})

const user = model("User", UserSchema);

module.exports = {user, UserSchema};