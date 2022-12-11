const express = require("express");
const router = express.Router();
const message = require("../Schema/MessageSchema")
const authMiddleware = require("../middlware/authMiddleware");
const room = require("../Schema/RoomSchema");
const roomMiddleware = require("../middlware/roomMiddleware");
const mongoose = require("mongoose");
router.use(authMiddleware)
router.use(roomMiddleware);


router.post("/send_message", async (req, res) => {
    const {message_body, room_id} = req.body;
    const user = req.user;
    const roomQuery = await room.find({ _id: room_id, 'participants._id': user[0]._id });
    if (roomQuery.length > 0) {
        console.log(mongoose.Types.ObjectId(room_id))
        const postMessage = new message({
            message: message_body,
            room_id: mongoose.Types.ObjectId(room_id),
            user_id: mongoose.Types.ObjectId(user[0]._id)
        })
        postMessage.save();
        return res.status(201).json({ status: true, message: "Message is created successfully"})
    } else {
        return res.status(403).json({ status: false, message: "You are not part of this room"})
    }
})

router.get("/get_message", async (req, res) => {
    const {room_id} = req.body;
    const user = req.user;

    const roomQuery = await room.find({ _id: room_id, 'participants._id': user[0]._id });
    if (roomQuery.length > 0) {
        const messageQuery = await message.find({ room_id: room_id }).populate("room_id").populate("user_id");
        console.log("messageQuery", messageQuery)
    } else {
        return res.status(403).json({ status: false, message: "You are not part of this room"})
    }
})
module.exports = router;