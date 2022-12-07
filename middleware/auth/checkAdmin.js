import User from "./../../db/models/user";
const jwt = require("jsonwebtoken");

const isAdmin = async (req, res, next) => {
  try {
    //   console.log(req.body);
    if (req.body.userType === "admin") {
      const token = req.header("Authorization").replace("Bearer ", "");
      const decoded = await jwt.verify(token, process.env.JWT_SECRET);
      const userAdmin = await User.findOne({
        _id: decoded._id,
        "tokens.token": token
      });
      if (!userAdmin) {
        throw new Error();
      }
      next();
    } else {
      next();
    }
  } catch (error) {
    res.status(401).send({ message: "the account create is not admin" });
  }
};

module.exports = isAdmin;
