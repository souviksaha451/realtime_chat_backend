const jwt = require("jsonwebtoken")
const PRIVATE_KEY = require("../constants/const");
const {user} = require("../Schema/UserSchema");
module.exports = function authMiddleware(req, res, next) {
    const {authorization} = req.headers;
    if (!authorization) {
        return res.status(422).json({ status: true, message: "Please provide token"})
    }

    jwt.verify(authorization, PRIVATE_KEY, async (err, result) => {
        console.log("error", err, result)
        if (!err) {
            const user_id = result.id;
            const userQuery = await user.find({ _id: user_id });
            if (userQuery.length > 0) {
                console.log("userQuery", userQuery)
                req.user = userQuery;
                next();
            } else {
                return res.status(422).json({ status : false, message: "No user exist"})
            }
        } else {
            return res.status(422).json({ status : false, message: "Invalid Token"})
        }
    })
}