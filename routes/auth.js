import express from "express";
import User from "../models/user";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import verifyLogin from "../middleware/verifyLogin";

const { SENDGRID_API, JWT_SECRET } = require("../config/keys");
const sgMail = require("@sendgrid/mail");

const router = express.Router();

router.get("/", (req, res) => {
  res.send("Hello Auth");
});

router.post("/signup", async (req, res) => {
  const { name, email, password, image } = req.body;
  if (!email || !name || !password) {
    return res.status(422).json({ err: "Please enter all the fields" });
  } else {
    const hashedpass = await bcrypt.hash(password, 12);
    User.findOne({ email }).then((user) => {
      if (user) {
        res.status(422).json({ err: "user already exists" });
      } else {
        console.log(password, hashedpass);
        const newUser = new User({
          name,
          email,
          password: hashedpass,
          image: image ? image : undefined,
        });
        newUser
          .save()
          .then((user) => {
            sgMail.setApiKey(SENDGRID_API);
            const msg = {
              to: user.email,
              from: "aaryanmahendra22835@gmail.com",
              subject: "Sign-Up Success",
              text: "Successfully signed in to Blog-up",
              html: "<h1>Welcome to <b>Blog-Up</b></h1>",
            };
            sgMail
              .send(msg)
              .then(() => {
                console.log("Email Sent");
              })
              .catch((err) => {
                console.log(err);
              });
            res.json({ success: "User saved SuccessFully" });
          })
          .catch((err) => {
            res.status(404).json({ err: "Error saving account" });
          });
      }
    });
  }
});

router.post("/signin", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(422).json({ err: "Please enter all the fields" });
  }
  const foundUser = await User.findOne({ email });
  if (foundUser) {
    const comparePass = await bcrypt.compare(password, foundUser.password);
    if (comparePass) {
      const token = await jwt.sign({ _id: foundUser._id }, JWT_SECRET);
      foundUser.password = undefined;
      res.json({ success: "Signed In Successfully", token, user: foundUser });
    } else {
      res.status(404).json({ err: "Invalid email or password" });
    }
  } else {
    res.status(404).json({ err: "Invalid email or password" });
  }
});

//
export default router;
