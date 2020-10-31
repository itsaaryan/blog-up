import mongoose from "mongoose";

const postSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  image: {
    type: String,
    default: "https://neilpatel.com/wp-content/uploads/2018/10/blog.jpg",
  },
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  unlikes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  created: { type: Date, required: true },
  postedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  comments: [
    {
      postedBy: {
        _id: { type: String },
        name: { type: String },
        image: {
          type: String,
          default:
            "https://tanzolymp.com/images/default-non-user-no-photo-1.jpg",
        },
      },
      comment: String,
    },
  ],
});

const postModel = new mongoose.model("Post", postSchema);

export default postModel;
