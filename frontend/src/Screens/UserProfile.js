import React, { useContext, useEffect, useState } from "react";
import "./Profile.css";
import { UserContext } from "../App";
import ReactLoading from "react-loading";
import Blog from "./Blog";
import { useParams } from "react-router-dom";
import { setSubstitutionWrappers } from "@sendgrid/mail";

function Profile() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setloading] = useState(false);
  const [totallikes, setTotallikes] = useState(0);
  const [blogRating, setBlogRating] = useState(0);
  const params = useParams();
  const [user, setUser] = useState({});

  useEffect(() => {
    fetch(`/user/userprofile/${params.id}`, {
      method: "get",
      headers: {
        "Content-Type": "application/json",
        // prettier-ignore
        "Authorization": "Bearer " + JSON.parse(localStorage.getItem("jwt")),
      },
    })
      .then((res) => res.json())
      .then((user) => {
        console.log(user);
        setUser(user.user);
      });
  }, []);

  useEffect(() => {
    setloading(true);
    fetch(`/user/userposts/${params.id}`, {
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
        setBlogs(result.result);
        setloading(false);
      });
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
  }, []);

  return (
    <div className="profile">
      <div className="profile-upperhalf">
        <div className="profile-img">
          <img src={user?.image}></img>
        </div>
        <div className="userInfo">
          <h1>{user?.name}</h1>
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
          <b>{blogs ? blogs.length : 0}</b> Blogs
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
              image={blog.image}
              title={blog.title}
              content={blog.content}
              created={blog.created}
              likes={blog.likes}
              unlikes={blog.unlikes}
              comments={blog.comments}
            />
          ))}
      </div>
    </div>
  );
}

export default Profile;
