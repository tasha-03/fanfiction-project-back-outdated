const express = require("express");
const fandomsController = require("../controllers/fandoms");
const auth = require("./middlewares/auth");
// const { sign: signToken } = require("../utils/token");
const { wrap } = require("async-middleware");

const router = express.Router();

router.post(
  "/",
  auth("ADMIN"),
  wrap(async (req, res) => {
    await fandomsController.createFandom({ name: req.body.name });
    res.send({ success: true });
  })
);

router.patch(
  "/:id",
  auth("ADMIN"),
  wrap(async (req, res) => {
    await fandomsController.updateFandom({
      fandomId: req.params.id,
      name: req.body.name,
    });
    res.send({ success: true });
  })
);

router.delete(
  "/:id",
  auth("ADMIN"),
  wrap(async (req, res) => {
    await fandomsController.deleteFandom({ fandomId: req.params.id });
    res.send({ success: true });
  })
);

router.get(
  "/",
  wrap(async (req, res) => {
    const fandoms = await fandomsController.getAllFandoms();
    res.send({ success: true, fandoms });
  })
);

router.get(
  "/:id",
  wrap(async (req, res) => {
    const fandom = await fandomsController.getFandomById({
      fandomId: req.params.id,
    });
    res.send({ success: true, fandom });
  })
);

router.post(
  "/search",
  wrap(async (req, res) => {
    const fandoms = await fandomsController.getFandomsByName({
      name: req.body.name,
    });
    res.send({ success: true, fandoms });
  })
);

router.post(
  "/categories",
  wrap(async (req, res) => {
    const fandoms = await fandomsController.getFandomByCategory({
      category: req.body.category,
      limit: req.query.limit,
      page: req.query.page,
    });
    res.send({ success: true, fandoms });
  })
);

module.exports = router;
