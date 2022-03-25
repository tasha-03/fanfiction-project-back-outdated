const express = require("express");
const warningsController = require("../controllers/warnings");
const auth = require("./middlewares/auth");
// const { sign: signToken } = require("../utils/token");
const { wrap } = require("async-middleware");

const router = express.Router();

router.post(
  "/",
  auth("ADMIN"),
  wrap(async (req, res) => {
    await warningsController.createWarning({ name: req.body.name });
    res.send({ success: true });
  })
);

router.patch(
  "/:id",
  auth("ADMIN"),
  wrap(async (req, res) => {
    await warningsController.updateWarning({
      warningId: req.params.id,
      name: req.body.name,
    });
    res.send({ success: true });
  })
);

router.delete(
  "/:id",
  auth("ADMIN"),
  wrap(async (req, res) => {
    await warningsController.deleteWarning({ warningId: req.params.id });
    res.send({ success: true });
  })
);

router.get(
  "/",
  wrap(async (req, res) => {
    const warnings = await warningsController.getAllWarnings();
    res.send({ success: true, warnings });
  })
);

router.get(
  "/:id",
  wrap(async (req, res) => {
    const warning = await warningsController.getWarningById({
      warningId: req.params.id,
    });
    res.send({ success: true, warning });
  })
);

router.post(
  "/search",
  wrap(async (req, res) => {
    const warnings = await warningsController.getWarningsByName({
      name: req.body.name,
    });
    res.send({ success: true, warnings });
  })
);

module.exports = router;
