const room = require("../Schema/RoomSchema")
module.exports = async (req, res, next) => {
    const room_id = req.body;
    if (!room_id) {
        return res.status(403).json({ status: false, message: "Please provide room id"})
    }

    const roomQuery = await room.find({_id: room_id });
    if (roomQuery.length > 0) {
        req.room = roomQuery;
        next()
    } else {
        return res.status(403).json({ status: false, message: "No Rooms exist"})
    }
}