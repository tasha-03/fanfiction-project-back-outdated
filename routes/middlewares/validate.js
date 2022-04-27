const { validationResult } = require("express-validator");

const validate = () => (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).send({ success: false, code: "WRONG_REQUEST", errors: errors.array() });
    return;
  }
  next();
};

module.exports = validate;