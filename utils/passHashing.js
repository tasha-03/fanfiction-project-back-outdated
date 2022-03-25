const bcrypt = require("bcrypt");

exports.hashPass = async (password) => {
  return await bcrypt.hash(password, bcrypt.genSalt(10));
};

exports.checkPass = async (password, hashedPass) => {
  return await bcrypt.compare(password, hashedPass);
};
