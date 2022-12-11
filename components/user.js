const express = require("express");
const {user} = require("../Schema/UserSchema");
const bcrypt = require("bcrypt");
const router = express.Router();
const nodemailer = require("nodemailer")
const jwt = require("jsonwebtoken");
const PRIVATE_KEY = require("../constants/const")

router.post("/register", async (req, res) => {
    const {firstName, lastName, userName, email, password} = req.body;
    if (firstName === "" || lastName === "" || userName === "" || email === "" || password === "") {
        return res.status(422).json({ status: false, message: "Please fill all details"})
    }

    let testAccount = await nodemailer.createTestAccount()

    let transporter = nodemailer.createTransport({
        host: "smtp.ethereal.email",
        port: 587,
        secure: false,
        auth: {
            user: testAccount.user,
            pass: testAccount.pass
        },
    });

    

    const userQuery = await user.find({ $or:[{username: userName },{email: email}]});
    console.log("userQuery", userQuery);
    if (userQuery.length > 0) {
        return res.status(422).json({ status: false, message: "Account already exists" })
    } else {
        bcrypt.genSalt(15, (err, salt) => {
            if (!err) {
                bcrypt.hash(password, salt, (error, hash) => {
                    console.log("hash", hash)
                    if (!error) {
                        const otp = Math.floor(1000+Math.random()*100000).toString();
                        console.log("otp", otp);
                        bcrypt.hash(otp, salt, async (error, salted_otp) => {
                            console.log("salted_otp", salted_otp)
                            const new_user = new user({
                                firstName: firstName,
                                lastName: lastName,
                                email: email,
                                username: userName,
                                password: hash,
                                otp: salted_otp,
                            });
                            new_user.save();
                            
                            let info = await transporter.sendMail({
                                from: "<foo@example.com>",
                                to: email,
                                subject: "Sending of Activation email",
                                html: `<b>Your Activation Code is ${otp}</b>`
                            })
                            console.log("info", info.messageId)
                            return res.status(201).json({ status: true, message: "User is created successfully"})
                        });
                    }
                })
            }
        })
    }
})

router.post("/activate_user", async (req, res) => {
    const {email, otp} = req.body;
    const userQuery = await user.find({ email: email });
    if (userQuery.length > 0) {
        const hashed_otp = userQuery[0].otp;
        bcrypt.compare(otp, hashed_otp, async (err, result) => {
            console.log("result", result, err)
            if (result === true) {
                let activate = await user.findOneAndUpdate({email: email}, {account_active: true });
                console.log("activate", activate);
                return res.json({ status: true, message: "Your account is activated successfully"})
            } else {
                return res.status(422).json({ status: false, message: "Invalid OTP" })
            }
        })
    } else {
        return res.status(422).json({ status: false, message: "No user exists" })
    }
})

router.post("/login", async (req, res) => {
    const {email, password} = req.body;
    let userQuery = await user.find({ email: email });
    if (userQuery.length > 0) {
        if (userQuery[0].account_active === true) {
            const Password = userQuery[0].password;
            bcrypt.compare(password, Password, async (err, result) => {
                if (result === true) {
                    const token = jwt.sign({ id: userQuery[0]._id }, PRIVATE_KEY);
                    let updateUser = await user.findOneAndUpdate({email: email}, {token: token})
                    console.log(updateUser)
                    return res.status(200).json({ status: true, message: "Successfully logged in", token })
                } else {
                    return res.status(422).json({ status: false, message: "Invalid Password"})
                }
            })
        } else {
            return res.status(422).json({ status: false, message: "Your account is not activated"})
        }
    } else {
        return res.status(422).json({ status: false, message: "No user exist"})
    }
})

module.exports = router;