const express = require("express");
const usersController = require("../controllers/users");
const auth = require("./middlewares/auth");
const { sign: signToken } = require("../utils/token");
const { wrap } = require("async-middleware");
const validate = require("./middlewares/validate");
const { body, param, query } = require("express-validator");
const { TZs } = require("./middlewares/TZs");

const router = express.Router();

router.post(
  "/signup",
  body("login")
    .trim()
    .matches(/^(?=.*[A-Za-z0-9]$)[A-Za-z][A-Za-z\d.\-_]{7,}$/)
    .withMessage(
      "Your login must contain at least 8 symbols, start with a letter, end with a letter or number, contain letters, numbers, hyphen or underscore, and must not contain spaces, special characters, or emoji."
    ),
  body("email")
    .trim()
    .normalizeEmail()
    .isEmail()
    .withMessage("Please provide proper email address."),
  body("password")
    .trim()
    .isStrongPassword()
    .withMessage(
      "The password must contain at least 8 symbols, have at least one number, one uppercase letter, one lowercase letter and one special symbol."
    ),
  validate(),
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
  body("confirmationCode")
    .trim()
    .isLength({ min: 6, max: 6 })
    .withMessage("Confirmation code must consist of exactly 6 symbols."),
  validate(),
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
  body("login").trim(),
  body("password").trim(),
  validate(),
  wrap(async (req, res) => {
    const { login, password } = req.body;
    const { userId } = await usersController.login({ login, password });
    const token = signToken(userId);
    res.send({ success: true, token });
  })
);

router.get(
  "/myself",
  query("tz").isIn(TZs),
  validate(),
  auth("USER"),
  wrap(async (req, res) => {
    res.send({ success: true, user: req.user });
  })
);

router.post(
  "/",
  body("login")
    .trim()
    .isString()
    .customSanitizer((value) => {
      value = value.replace("?", "\\?");
      return value.replace("_", "\\_");
    }),
  query("limit").optional().trim().isInt(),
  query("page").optional().trim().isInt(),
  validate(),
  wrap(async (req, res) => {
    const users = await usersController.getUsersByLogin({
      login: req.body.login,
      limit: req.query.limit,
      page: req.query.page,
    });
    res.send({ success: true, users });
  })
);

router.get(
  "/deactivate",
  auth("USER"),
  wrap(async (req, res) => {
    await usersController.deactivateProfile({ userId: req.user.userId });
    res.send({ success: true });
  })
);

router.get(
  "/activate",
  auth("USER"),
  wrap(async (req, res) => {
    await usersController.activateProfile({ userId: req.user.userId });
    res.send({ success: true });
  })
);

router.get(
  "/:id",
  param("id").isInt(),
  validate(),
  wrap(async (req, res) => {
    const user = await usersController.getUserById({
      userId: req.params.id,
      tz: req.query.tz,
    });
    res.send({ success: true, user });
  })
);

router.post(
  "/password/restore",
  auth("USER"),
  wrap(async (req, res) => {
    await usersController.restorePassword({
      userId: req.user.userId,
      password: req.body.password,
      passRestored: true,
    });
    res.send({ success: true });
  })
);

module.exports = router;
