const express = require("express");
const userRouter = require("./users");
const workRouter = require("./works");
const warningRouter = require("./warnings");
const tagRouter = require("./tags");
const fandomRouter = require("./fandoms");

const router = express.Router();

router.use(express.json());

router.use("/users", userRouter);
router.use("/works", workRouter);
router.use("/warnings", warningRouter);
router.use("/tags", tagRouter);
router.use("/fandoms", fandomRouter);

router.use((req, res) => {
  res.send({ success: false, code: "NOT_IMPLEMENTED" });
});

router.use((err, req, res, next) => {
  console.log(err);
  if (err.name === "CONTROLLER_EXCEPTION") {
    res.send({ success: false, code: err.exceptionCode, message: err.message });
  } else {
    res.send({ success: false, code: "INTERNAL_ERROR" });
  }
});

module.exports = router;
