const express = require("express");
const authMiddleware = require("../middlware/authMiddleware");
const room = require("../Schema/RoomSchema");
const router = express.Router();

router.use(authMiddleware)

router.post("/create_room", function(req, res) {
        const user = req.user;
    console.log("user", user, req.user);
    const {room_name, room_desc} = req.body;
    const create_room = new room({
        room_name: room_name,
        room_description: room_desc,
        participants: user,
        admin: user
    })

    create_room.save();
    return res.status(201).json({ status: true, message: "Room created successfully"})
})

router.post("/join_new_room/:room_id", async (req, res) => {
    const {room_id} = req.params;
    const user = req.user;
    console.log("room_id", room_id, user);
    const roomQuery = await room.find({ _id: room_id });
    if (roomQuery.length > 0) {
        const participant_exist = await room.find({ _id: room_id, 'participants._id': user[0]._id });
        if (participant_exist.length > 0) {
            return res.status(422).json({ status: false, message: "You already joined this room"})
        } else {
            var participants = roomQuery[0].participants;
            participants.push(user[0]);
        let participant_update = await room.findOneAndUpdate({_id: room_id}, {participants: participants});
        console.log(participant_update);
        return res.status(201).json({ status: true, message: "You successfully joined to this room"})
        }
    } else {
       return res.status(422).json({ status: false, message: "No rooms are exist" }) 
    }
})

router.get("/get_list_joined_rooms", async (req, res) => {
    const user = req.user;
    const roomQuery = await room.find({ 'participants._id': user[0]._id });
    return res.json({ status: true, data: roomQuery})
})

router.post("/exit_from_room", async (req, res) => {
    const user = req.user;
    const {room_id} = req.body;
    const roomQuery = await room.find({_id: room_id, 'participants._id': user[0]._id });
    if (roomQuery.length > 0) {
        var participants = roomQuery[0].participants;
        const findIndex = participants.findIndex((value) => { return value._id.toString() === user[0]._id.toString() });
        participants.splice(findIndex, 1);
        let participant_update = await room.findOneAndUpdate({_id: room_id}, {participants: participants});
        return res.status(200).json({ status: true, message: "Successfully exit from this room"})
    } else {
        return res.status(422).json({ status: false, message: "No user is found in this room"})
    }
})

router.delete("/remove_room", async (req, res) => {
    const user = req.user;
    const {room_id} = req.body;
    const roomQuery = await room.find({_id: room_id, 'participants._id': user[0]._id });
    if (roomQuery.length > 0) {
        let delete_room = await room.findOneAndDelete({ _id: room_id });
        return res.json({ status: true, message: "Room is deleted successfully"})
    } else {
        return res.status(403).json({ status: false, message: "You don't have admin access to this room"})
    }
})

module.exports = router;