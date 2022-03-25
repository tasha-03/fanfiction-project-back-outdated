const express = require("express");
const tagsController = require("../controllers/tags");
const auth = require("./middlewares/auth");
// const { sign: signToken } = require("../utils/token");
const { wrap } = require("async-middleware");

const router = express.Router();

router.post(
  "/",
  auth("ADMIN"),
  wrap(async (req, res) => {
    await tagsController.createTag({
      name: req.body.name,
      category: req.body.category,
    });
    res.send({ success: true });
  })
);

router.patch(
  "/:id",
  auth("ADMIN"),
  wrap(async (req, res) => {
    await tagsController.updateTag({
      tagId: req.params.id,
      name: req.body.name,
      category: req.body.category,
    });
    res.send({ success: true });
  })
);

router.delete(
  "/:id",
  auth("ADMIN"),
  wrap(async (req, res) => {
    await tagsController.deleteTag({ tagId: req.params.id });
    res.send({ success: true });
  })
);

router.get(
  "/",
  wrap(async (req, res) => {
    const tags = await tagsController.getAllTags();
    res.send({ success: true, tags });
  })
);

router.get(
  "/:id",
  wrap(async (req, res) => {
    const tag = await tagsController.getTagById({
      tagId: req.params.id,
    });
    res.send({ success: true, tag });
  })
);

router.post(
  "/search",
  wrap(async (req, res) => {
    const tags = await tagsController.getTagsByName({
      name: req.body.name,
    });
    res.send({ success: true, tags });
  })
);

module.exports = router;
