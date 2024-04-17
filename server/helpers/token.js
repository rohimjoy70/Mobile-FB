const jwt = require("jsonwebtoken");
const secret = process.env.JWT_SECRET;

const signToken = (paylod) => {
  return jwt.sign(paylod, secret);
};

const verifyToken = (token) => {
  return jwt.verify(token, secret);
};

module.exports = { signToken, verifyToken };
