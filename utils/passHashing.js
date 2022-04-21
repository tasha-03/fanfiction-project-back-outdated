const bcrypt = require("bcrypt");

exports.hashPass = async (password) => {
  const salt = await bcrypt.genSalt(10)
  return await bcrypt.hash(password, salt);
};

exports.checkPass = async (password, hashedPass) => {
  return await bcrypt.compare(password, hashedPass);
};
