require("dotenv").config();
const router = require("express").Router();
const UserModel = require("../models/UserModel.js");

router.post("/sign_up", async (req, res) => {
    if (!req.body) {
        return res.status(500).json({ message: "Your First Name, Last Name, Username and a Password are required to continue." }).send();
    }

    let user = new UserModel(req.body);
    try {
        await user.save();
        res.cookie("username", req.body.username, { expires: new Date(Date.now() + 900000) })
        .status(201)
        .json({ status: 1, message: "Done" })
        .send();
    } catch (err) {
        return res.status(500).json({ message: err.message }).send();
    }
});


router.post("/login", async (req, res) => {
    if (!req.body) {
        return res.status(500).json({ message: "A Username and Password are required." }).send();
    }

    let { username, password } = req.body;
    try {
        let user = await UserModel.findOne({ username: username });
        if (!user) {
            return res.status(500).json({ message: "This Username cannot be not found" }).send();
        }

        if (user.password != password) {
            return res.status(500).json({ message: "Your username/password is incorrect" }).send();
        }

        return res
            .cookie("username", username, { expires: new Date(Date.now() + 90000) })
            .status(201)
            .json({ status: 1, message: "Done" })
            .send();
        } catch (err) {

    return res.status(500).json({ message: err.message }).send();
    
    }
});

module.exports = router;