import React, { useContext, useEffect, useState } from "react";
import "./Profile.css";
import { UserContext } from "../App";
import ReactLoading from "react-loading";
import Blog from "./Blog";

function Profile() {
  const { state, dispatch } = useContext(UserContext);
  const [blogs, setBlogs] = useState([]);
  const [loading, setloading] = useState(false);
  const [totallikes, setTotallikes] = useState(0);
  const [blogRating, setBlogRating] = useState(0);

  useEffect(() => {
    setloading(true);
    fetch("/posts/myposts", {
      method: "get",
      headers: {
        "Content-Type": "application/json",
        // prettier-ignore
        "Authorization": "Bearer " + JSON.parse(localStorage.getItem("jwt")),
      },
    })
      .then((res) => res.json())
      .then((result) => {
        console.log(result);
        setBlogs(result.posts);
        setloading(false);
      });
  }, []);

  useEffect(() => {
    var sum = 0;
    var sum2 = 0;
    for (var i = 0; i < blogs?.length; i++) {
      sum += blogs[i].likes.length;
    }
    setTotallikes(sum);
    for (var i = 0; i < blogs?.length; i++) {
      sum2 += blogs[i].likes.length - blogs[i].unlikes.length;
    }
    setBlogRating(sum2);
    return () => {
      //
    };
  }, []);

  return (
    <div className="profile">
      <div className="profile-upperhalf">
        <div className="profile-img">
          <img src={state.user?.image}></img>
        </div>
        <div className="userInfo">
          <h1>{state.user?.name}</h1>
        </div>
      </div>
      <hr></hr>
      <div className="rating-container">
        <p>
          <b>{totallikes}</b> Total-Likes
        </p>
        <p>
          <b>{blogRating}</b> Blogger-rating
        </p>
        <p>
          <b>{blogs?.length}</b> Blogs
        </p>
      </div>
      <hr></hr>
      <div className="profile-lowerhalf">
        <h1>My Blogs</h1>

        {loading && (
          <div style={{ display: "grid", justifyItems: "center" }}>
            <ReactLoading type="cubes" color="#3f51b5" height={50} width={50} />
          </div>
        )}
        {!loading &&
          blogs?.map((blog, i) => (
            <Blog
              key={i}
              _id={blog._id}
              image={blog.image}
              title={blog.title}
              content={blog.content}
              created={blog.created}
              likes={blog.likes}
              unlikes={blog.unlikes}
              comments={blog.comments}
              accountholder
            />
          ))}
      </div>
    </div>
  );
}

export default Profile;
