const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
dotenv.config();
const mongoose = require("mongoose");
const app = express();
const message = require("./components/message")
const room = require("./components/room")
const PORT = process.env.PORT || 5000;
app.use(express.json());
app.use(cors({origin: "*"}))
const url = process.env.MONGO_URL
const user = require("./components/user")
app.use("/api/user", user)
app.use("/api/room", room)
app.use("/api/message", message)
mongoose.set("strictQuery", false)
mongoose.connect(url).then((res) => {
    console.log("connected to mongodb")
}).catch((err) => {
    console.log("Not connected to mongodb", err)
})

app.listen(PORT, () => {
    console.log(`Server listening on http://localhost:${PORT}`)
})