const jwt = require("jsonwebtoken");
const usersController = require("../../controllers/users");

const auth = (role) => async (req, res, next) => {
  const token = req.headers.token;
  let data = {};
  try {
    data = jwt.verify(token, process.env.JWT_SECRET_KEY);
  } catch (err) {
    res.send({ success: false, code: "ACCESS_DENIED" });
  }

  const userId = data.userId;
  const user = usersController.getUserById({ userId });
  if (user.role !== role) {
    res.send({ success: false, code: "ACCESS_DENIED" });
  }

  req.user = user;
  next();
};
