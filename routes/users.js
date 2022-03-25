const express = require("express");
const usersController = require("../controllers/users");
const auth = require("./middlewares/auth");
const { sign: signToken } = require("../utils/token");
const { wrap } = require("async-middleware");
// const {validate} = require("./middlewares/validate");

const router = express.Router();

router.post(
  "/signup",
  wrap(async (req, res) => {
    const { login, email, password } = req.body;
    const { userId } = await usersController.register({
      login,
      email,
      password,
    });
    const token = signToken(userId);
    res.send({ success: true, token });
  })
);

router.post(
  "/email/confirm/request",
  auth("USER"),
  wrap(async (req, res) => {
    await usersController.requestEmailConfirmation({ userId: req.user.userId });
    res.send({ success: true });
  })
);

router.post(
  "/email/confirm",
  auth("USER"),
  wrap(async (req, res) => {
    const { code } = req.body;
    await usersController.confirmEmail({
      userId: req.user.userId,
      confirmationCode: code,
    });
    res.send({ success: true });
  })
);

router.post(
  "/login",
  wrap(async (req, res) => {
    const { login, password } = req.body;
    const { userId } = await usersController.login({ login, password });
    const token = signToken(userId);
    res.send({ success: true, token });
  })
);

module.exports = router;
