const express = require("express");
// const jwt = require("jsonwebtoken");
const historyController = require("../controllers/history");
const auth = require("./middlewares/auth");
const { wrap } = require("async-middleware");
const res = require("express/lib/response");

const router = express.Router();

router.get(
  "/:id",
  auth("USER"),
  wrap(async (req, res) => {
    await historyController.createRecord({
      userId: req.user.userId,
      workId: req.params.id,
    });
    res.send({ success: true });
  })
);

router.delete(
  "/:id",
  auth("USER"),
  wrap(async (req, res) => {
    await historyController({
      recordId: req.params.id,
      userId: req.user.userId,
    });
    res.send({success: true})
  })
);
