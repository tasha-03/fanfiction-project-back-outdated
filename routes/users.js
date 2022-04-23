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

router.get(
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
    const { confirmationCode } = req.body;
    await usersController.confirmEmail({
      userId: req.user.userId,
      confirmationCode: confirmationCode,
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

router.get(
  "/myself",
  auth("USER"),
  wrap(async (req, res) => {
    // const user = await usersController.getUserById({
    //   userId: req.user.userId,
    //   tz: req.query.tz,
    // });
    res.send({ success: true, user: req.user });
  })
);

router.get(
  "/:id",
  wrap(async (req, res) => {
    const user = await usersController.getUserById({
      userId: req.params.id,
      tz: req.query.tz,
    });
    res.send({ success: true, user });
  })
);

router.get(
  "/",
  wrap(async (req, res) => {
    const users = await usersController.getAllUsers({
      limit: req.query.limit,
      page: req.query.page,
    });
    res.send({ success: true, users });
  })
);

router.post(
  "/",
  wrap(async (req, res) => {
    const users = await usersController.getUsersByLogin({
      login: req.body.login,
      limit: req.query.limit,
      page: req.query.page,
    });
    res.send({ success: true, users });
  })
);

module.exports = router;
