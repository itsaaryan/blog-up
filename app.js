import authRoute from "./routes/auth";
import postsRoute from "./routes/posts";
import express from "express";
import mongoose from "mongoose";
import Pusher from "pusher";
import bodyParser from "body-parser";
import userRoute from "./routes/user";

const { MONGOURI } = require("./config/keys");

const app = express();
const PORT = process.env.PORT || 5000;

mongoose.connect(MONGOURI, { useNewUrlParser: true, useUnifiedTopology: true });

app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/auth", authRoute);
app.use("/posts", postsRoute);
app.use("/user", userRoute);

const db = mongoose.connection;

db.on("error", (err) => {
  console.log("there was some error while connecting to mongo server", err);
});

if (process.env.NODE_ENV == "production") {
  app.use(express.static("frontend/build"));
  const path = require("path");
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "frontend", "build", "index.html"));
  });
}

db.once("open", () => {
  app.listen(PORT, () => {
    console.log("server started at port", PORT);
  });
});
