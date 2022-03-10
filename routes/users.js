const express = require("express");
const jwt = require("jsonwebtoken");
const usersController = require("../controllers/users");
const auth = require("./middlewares/auth");

const router = express.Router();

router.post("/signup", async (req, res) => {
    const {login, email, password} = req.body;
    const {userId} = await usersController.register({login, email, password});

    jwt.sign({ userId }, process.env.JWT_SECRET_KEY, {expiresIn: "1h"})

    res.send({ success: true })
})

module.exports = router;