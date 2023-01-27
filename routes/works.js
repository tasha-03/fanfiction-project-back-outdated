const express = require("express");
const worksController = require("../controllers/works");
const auth = require("./middlewares/auth");
const { wrap } = require("async-middleware");

const router = express.Router();

router.get(
  "/drafts",
  auth("USER"),
  wrap(async (req, res) => {
    const works = await worksController.getMyDrafts({
      userId: req.user.userId,
    });
    res.send({ success: true, works });
  })
);

router.get(
  "/authors/:login",
  wrap(async (req, res) => {
    const works = await worksController.getWorksByAuthorLogin({
      login: req.params.login,
      limit: req.query.limit,
      page: req.query.page,
    });
    res.send({ success: true, works });
  })
);

router.get(
  "/myworks/:id",
  auth("USER"),
  wrap(async (req, res) => {
    const work = await worksController.getMyWorkById({
      workId: req.params.id,
      userId: req.user.userId,
    });
    res.send({ success: true, work });
  })
);

router.get(
  "/:id",
  wrap(async (req, res) => {
    const work = await worksController.getWorkById({ workId: req.params.id });
    res.send({ success: true, work: work });
  })
);

router.get(
  "/",
  wrap(async (req, res) => {
    const {works, pageCount} = await worksController.getAllWorks({
      page: req.query.page,
      limit: req.query.limit,
      orderby: req.query.orderby,
      order: req.query.order,
    });
    res.send({ success: true, works, pageCount });
  })
);

router.post(
  "/",
  auth("USER"),
  wrap(async (req, res) => {
    const {
      title,
      rating,
      category,
      language,
      description,
      note,
      finished,
      tags,
      fandoms,
      warnings,
    } = req.body;
    const { workId } = await worksController.createWork({
      title,
      authorId: req.user.userId,
      rating,
      category,
      language,
      description,
      note,
      finished,
      tags,
      fandoms,
      warnings,
    });
    res.send({ success: true, workId });
  })
);

router.patch(
  "/:id",
  auth("USER"),
  wrap(async (req, res) => {
    const {
      title,
      rating,
      category,
      language,
      description,
      note,
      finished,
      tags,
      fandoms,
      warnings,
      isVisible,
    } = req.body;
    await worksController.updateWork({
      workId: req.params.id,
      title,
      authorId: req.user.userId,
      rating,
      category,
      language,
      description,
      note,
      finished,
      tags,
      fandoms,
      warnings,
      isVisible,
    });
    res.send({ success: true });
  })
);

router.delete(
  "/:id",
  auth("USER"),
  wrap(async (req, res) => {
    await worksController.deleteWork({
      workId: req.params.id,
      authorId: req.user.userId,
    });
    res.send({ success: true });
  })
);

module.exports = router;
