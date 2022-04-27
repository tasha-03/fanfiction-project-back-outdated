const express = require("express");
const usersController = require("../controllers/users");
const auth = require("./middlewares/auth");
const { wrap } = require("async-middleware");
const validate = require("./middlewares/validate");
const { body } = require("express-validator");

const router = express.Router();

router.use(auth("ADMIN"));

router.post(
  "/change-role",
  body("userId").trim().isInt(),
  body("role").optional().trim().toUpperCase().isIn(["ADMIN", "USER"]),
  validate(),
  wrap(async (req, res) => {
    await usersController.changeRole({
      userId: req.body.userId,
      role: req.body.role,
    });
    res.send({ success: true });
  })
);

router.post(
  "/deactivate",
  body("userId").trim().isInt(),
  validate(),
  wrap(async (req, res) => {
    await usersController.deactivateProfile({ userId: req.body.userId });
    res.send({ success: true });
  })
);

router.post(
    "/activate",
    body("userId").trim().isInt(),
    validate(),
    wrap(async (req, res) => {
      await usersController.activateProfile({ userId: req.body.userId });
      res.send({ success: true });
    })
  );
  
module.exports = router;
