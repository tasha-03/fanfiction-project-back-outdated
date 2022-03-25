const express = require("express");
const partsController = require("../controllers/parts");
const auth = require("./middlewares/auth");
const { wrap } = require("async-middleware");

const router = express.Router();

router.post(
  "/",
  auth("USER"),
  wrap(async (req, res) => {
    const partId = await partsController.createPart({
      workId: req.body.workId,
      authorId: req.user.userId,
      title: req.body.title,
      description: req.body.description,
      note: req.body.note,
      text: req.body.text,
      order: req.body.order,
      is_visible: req.body.is_visible,
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
      is_visible: req.body.is_visible,
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
