import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import ImageRoundedIcon from "@material-ui/icons/ImageRounded";
import { toast } from "react-toastify";
import "./CreateBlog.css";

function CeateBlog() {
  const [postImg, setpostImg] = useState("");
  const [title, settitle] = useState("");
  const [content, setcontent] = useState("");
  const history = useHistory();

  const setBlogImage = (e) => {
    e.preventDefault();
    console.log(e.target.files[0]);
    if (e.target.files[0]) {
      const data = new FormData();
      data.append("file", e.target.files[0]);
      data.append("upload_preset", "insta-clone");
      data.append("cloud_name", "dsxeglxhm");

      fetch("https://api.cloudinary.com/v1_1/dsxeglxhm/image/upload", {
        method: "post",
        body: data,
      })
        .then((res) => res.json())
        .then((data) => {
          setpostImg(data.url);
          console.log(postImg);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  const createBlog = (e) => {
    e.preventDefault();
    if (!title || !content) {
      toast.error("Please enter both title and content.", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: 0,
      });
      return;
    }
    console.log(localStorage.getItem("jwt"));
    fetch("/posts/createpost", {
      method: "post",
      headers: {
        "Content-Type": "application/json",
        // prettier-ignore
        "Authorization": "Bearer " + JSON.parse(localStorage.getItem("jwt")),
      },
      body: JSON.stringify({
        image: postImg ? postImg : undefined,
        title,
        content,
        created: Date.now(),
      }),
    })
      .then((res) => res.json())
      .then((result) => {
        console.log(result);
        if (result.post) {
          toast.success("Blog Created Successfully", {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: 0,
          });
          history.push("/");
        }
      })
      .catch((err) => console.log(err));
  };

  return (
    <form className="create">
      <div className="create-upperhalf">
        <img
          src={
            postImg
              ? postImg
              : "https://neilpatel.com/wp-content/uploads/2018/10/blog.jpg"
          }
        ></img>
        <label for="blogImg">
          <input
            id="blogImg"
            type="file"
            name="blogImg"
            onChange={setBlogImage}
            style={{ display: "none" }}
          />
          <div>
            <ImageRoundedIcon />
            <p>Upload Image</p>
          </div>
        </label>
      </div>
      <div className="create-lowerhalf">
        <h4>Title:</h4>
        <input
          type="text"
          onChange={(e) => settitle(e.target.value)}
          placeholder="Make it awesome!"
        ></input>
        <h4>Content:</h4>
        <textarea
          type="text"
          onChange={(e) => setcontent(e.target.value)}
          placeholder="Tip! Try to make it short and simple."
        ></textarea>
      </div>
      <button onClick={createBlog}>Create Blog</button>
    </form>
  );
}

export default CeateBlog;
