const bcrypt = require("bcryptjs");
const salt = bcrypt.genSaltSync(10);

const hashPassword = (password) => {
  return bcrypt.hashSync(password, salt);
};

const checkPassword = (password, hash) => {
  return bcrypt.compareSync(password, hash); // true
};

module.exports = { hashPassword, checkPassword };
