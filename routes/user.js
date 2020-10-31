import express from "express";
import verifyLogin from "../middleware/verifyLogin";
import User from "../models/user";
import Post from "../models/post";

const router = express.Router();

router.get("/userprofile/:id", verifyLogin, (req, res) => {
  const _id = req.params.id;
  User.findOne({ _id })
    .then((user) => {
      console.log(user);
      res.json({ user });
    })
    .catch((err) => res.status(404).json({ err: "USer not found" }));
});

router.get("/userposts/:id", verifyLogin, (req, res) => {
  const _id = req.params.id;
  Post.find({ postedBy: _id })
    .then((result) => {
      res.json({ result });
    })
    .catch((err) => res.status(404).json({ err }));
});

router.post("/updateprofile", verifyLogin, (req, res) => {
  User.findByIdAndUpdate(
    req.user._id,
    { $set: { image: req.body.image, name: req.body.name } },
    { new: true }
  )
    .then((result) => {
      result.password = undefined;
      res.json(result);
    })
    .catch((err) => res.status(422).json({ error: err }));
});

export default router;
