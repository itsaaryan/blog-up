import express from "express";
import verifyLogin from "../middleware/verifyLogin";
import User from "../models/user";
import Post from "../models/post";

const router = express.Router();

router.post("/createpost", verifyLogin, (req, res) => {
  const { title, content, image, created } = req.body;
  if (!title || !content) {
    return res.status(422).json({ err: "Please enter all the fields" });
  }
  const userInfo = req.user;
  userInfo.password = undefined;
  const post = new Post({
    title,
    content,
    image,
    created,
    postedBy: userInfo,
  });

  post
    .save()
    .then((post) => {
      res.json({ success: "post saved successfully", post });
    })
    .catch((err) => {
      res.status(422).json({ err: "error saving post" });
    });
});

router.get("/myposts", verifyLogin, (req, res) => {
  const _id = req.user._id;
  Post.find({ postedBy: _id })
    .then((posts) => {
      res.json({ posts });
    })
    .catch((err) => res.status(422).json({ err: "error while getting posts" }));
});

router.get("/allposts", (req, res) => {
  Post.find()
    .sort({ created: -1 })
    .populate("postedBy", "_id name email")
    .then((posts) => {
      res.json({ posts });
    })
    .catch((err) => res.status(422).json({ err: "Cannot fetch all posts" }));
});

router.get("/mostlikedposts", (req, res) => {
  Post.find()
    .sort({ likes: -1 })
    .populate("postedBy", "_id name email")
    .then((posts) => {
      res.json({ posts });
    })
    .catch((err) => res.status(422).json({ err: "Cannot fetch all posts" }));
});

router.put("/like", verifyLogin, async (req, res) => {
  Post.findByIdAndUpdate(
    req.body._id,
    {
      $push: { likes: req.user._id },
    },
    { new: true }
  )
    .populate("postedBy", "_id name image")
    .exec((err, result) => {
      if (err) {
        res.status(422).json({ error: err });
      } else {
        console.log(result);
        res.json({ result });
      }
    });
});

router.put("/unlike", verifyLogin, (req, res) => {
  Post.findByIdAndUpdate(
    req.body._id,
    {
      $push: { unlikes: req.user._id },
    },
    { new: true }
  )
    .populate("postedBy", "_id name image")
    .exec((err, result) => {
      if (err) {
        res.status(422).json({ error: err });
      } else {
        console.log(result);
        res.json({ result });
      }
    });
});

router.put("/comment", verifyLogin, (req, res) => {
  Post.findByIdAndUpdate(
    req.body._id,
    {
      $push: {
        comments: {
          comment: req.body.comment,
          postedBy: {
            _id: req.user._id,
            name: req.user.name,
            image: req.user.image,
          },
        },
      },
    },
    { new: true }
  )
    .populate("postedBy", "_id name image")
    .exec((err, result) => {
      if (err) {
        res.status(422).json({ error: err });
      } else {
        res.json(result);
      }
    });
});

router.get("/comments/:id", verifyLogin, (req, res) => {
  Post.fndOne({ _id: req.params.id })
    .populate("postedBy", "_id name email")
    .then((post) => {
      res.json({ post });
    })
    .catch((err) => res.status(422).json({ err: "Error loading comments" }));
});

router.delete("/delete/:id", verifyLogin, async (req, res) => {
  const _id = req.params.id;
  console.log(_id);
  Post.deleteOne({ _id }).exec((err, result) => {
    if (err) {
      res.status(422).json({ error: err });
    } else {
      res.json(result);
    }
  });
});

export default router;
