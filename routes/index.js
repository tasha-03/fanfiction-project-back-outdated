const express = require("express");
const userRouter = require("./users");
const workRouter = require("./works");
const warningRouter = require("./warnings");
const tagRouter = require("./tags");
const fandomRouter = require("./fandoms");
const adminRouter = require("./admin");
const partsRouter = require("./parts");
const historyRouter = require("./history");

const router = express.Router();

router.use(express.json());

router.use("/admin", adminRouter);
router.use("/users", userRouter);
router.use("/works", workRouter);
router.use("/warnings", warningRouter);
router.use("/tags", tagRouter);
router.use("/fandoms", fandomRouter);
router.use("/parts", partsRouter);
router.use("/history", historyRouter);

router.use((req, res) => {
  res.send({ success: false, code: "NOT_IMPLEMENTED" });
});

router.use((err, req, res, next) => {
  if (err.name === "CONTROLLER_EXCEPTION") {
    console.log(
      `Controller Exception: {\n  name: ${err.name},\n  exceptionCode: ${err.exceptionCode},\n  message: ${err.message}\n}`
    );
    res.send({ success: false, code: err.exceptionCode, message: err.message });
  } else {
    console.log(`Error occured:`, err);
    res.send({ success: false, code: "INTERNAL_ERROR", err });
  }
});

module.exports = router;
