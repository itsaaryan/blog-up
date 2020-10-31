import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  image: {
    type: String,
    default:
      "https://fertilitynetworkuk.org/wp-content/uploads/2017/01/Facebook-no-profile-picture-icon-620x389.jpg",
  },
  likes: { type: Number, default: 0 },
  dislikes: { type: Number, default: 0 },
});

const userModel = mongoose.model("User", userSchema);

export default userModel;
