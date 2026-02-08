const jwt = require("jsonwebtoken");
const User = require("../models/users");
const redisClient = require("../config/redis");

const userMiddleware = async (req, res, next) => {
  try {
    const { token } = req.cookies;

    if (!token) {
      return res.status(401).json({ message: "Token missing" });
    }

    const payload = jwt.verify(token, process.env.JWT_KEY);
    const user = await User.findById(payload._id);

    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    const isBlocked = await redisClient.exists(`token:${token}`);
    if (isBlocked) {
      return res.status(401).json({ message: "Token blocked" });
    }

    req.result = user;
    return next();

  } catch (err) {
    console.error("❌ userMiddleware error:", err.message);
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

module.exports = userMiddleware;
