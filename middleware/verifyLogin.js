import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config/keys";
import User from "../models/user";

const verifyLogin = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization) {
    return res.status(401).json({ err: "You must be signed-in" });
  } else {
    const token = authorization.replace("Bearer ", "");
    jwt.verify(token, JWT_SECRET, (err, payload) => {
      if (err) {
        res.status(401).json({ err: "You must be logged in" });
      } else {
        const { _id } = payload;
        User.findOne({ _id }).then((user) => {
          if (user) {
            req.user = user;
            next();
          }
        });
      }
    });
  }
};

export default verifyLogin;
