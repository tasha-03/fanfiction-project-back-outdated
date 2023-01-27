const express = require("express");
const partsController = require("../controllers/parts");
const auth = require("./middlewares/auth");
const { wrap } = require("async-middleware");
const validate = require("./middlewares/validate");
const { body } = require("express-validator");

const router = express.Router();

router.post(
  "/",
  body("text").escape(),
  validate(),
  auth("USER"),
  wrap(async (req, res) => {
    const { partId } = await partsController.createPart({
      workId: req.body.workId,
      authorId: req.user.userId,
      title: req.body.title,
      description: req.body.description,
      note: req.body.note,
      text: req.body.text,
      order: req.body.order,
      isVisible: req.body.isVisible,
    });
    res.send({ success: true, partId });
  })
);

router.patch(
  "/:partId",
  auth("USER"),
  wrap(async (req, res) => {
    await partsController.updatePart({
      partId: req.params.partId,
      authorId: req.user.userId,
      title: req.body.title,
      description: req.body.description,
      note: req.body.note,
      text: req.body.text,
      isVisible: req.body.isVisible,
    });
    res.send({ success: true });
  })
);

router.get(
  "/:partId",
  wrap(async (req, res) => {
    const part = await partsController.getPartById({
      partId: req.params.partId,
    });
    res.send({ success: true, part });
  })
);

router.delete(
  "/:partId",
  auth("USER"),
  wrap(async (req, res) => {
    const part = await partsController.getPartById({
      partId: req.params.partId,
      authorId: req.user.userId,
    });
    res.send({ success: true, part });
  })
);

router.get(
  "/work/:workId",
  wrap(async (req, res) => {
    const parts = await partsController.getPartsByWorkId({
      workId: req.params.workId,
    });
    res.send({ success: true, parts });
  })
);

router.get(
  "/work/:workId/all",
  auth("USER"),
  wrap(async (req, res) => {
    const parts = await partsController.getAllPartsByWorkId({
      workId: req.params.workId,
      authorId: req.user.userId,
    });
    res.send({ success: true, parts });
  })
);

module.exports = router;
