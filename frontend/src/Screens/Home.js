import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "../App";
import ReactLoading from "react-loading";
import Blog from "./Blog";
import "./Home.css";
import RatedTable from "./RatedTable";

function Home() {
  const { state, dispatch } = useContext(UserContext);
  const [allblogs, setallblogs] = useState([]);
  const [loading, setloading] = useState(false);

  // useEffect(() => {
  //   const pusher = new Pusher("2e85564c742c37fb03a4", {
  //     cluster: "ap2",
  //   });
  //   const channel = pusher.subscribe("posts");
  //   channel.bind("inserted", (data) => {
  //     console.log("data");
  //   });
  // }, []);

  useEffect(() => {
    setloading(true);
    fetch("/posts/allposts", {
      method: "get",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((result) => {
        setallblogs(result.posts);
        console.log(result.posts);
        setloading(false);
      })
      .catch((err) => {
        console.log(err);
        setloading(false);
      });
    return () => {
      //
    };
  }, []);

  const handleLike = (_id) => {
    fetch("/posts/like", {
      method: "put",
      headers: {
        "Content-Type": "application/json",
        //prettier-ignore
        "Authorization":"Bearer "+JSON.parse(localStorage.getItem("jwt")),
      },
      body: JSON.stringify({ _id }),
    })
      .then((res) => res.json())
      .then((post) => {
        setallblogs(
          allblogs.map((blog) => {
            if (post.result._id === blog._id) {
              return post.result;
            } else {
              return blog;
            }
          })
        );
      });
  };

  const handleUnlike = (_id) => {
    fetch("/posts/unlike", {
      method: "put",
      headers: {
        "Content-Type": "application/json",
        //prettier-ignore
        "Authorization":"Bearer "+JSON.parse(localStorage.getItem("jwt")),
      },
      body: JSON.stringify({ _id }),
    })
      .then((res) => res.json())
      .then((post) => {
        setallblogs(
          allblogs.map((blog) => {
            if (post.result._id === blog._id) {
              return post.result;
            } else {
              return blog;
            }
          })
        );
      });
  };

  return (
    <div className="home">
      <div className="home-left">
        <h2>Most Liked Users</h2>
        <RatedTable allblogs={allblogs} />
      </div>
      <div className="home-middle">
        {loading && (
          <div style={{ display: "grid", justifyItems: "center" }}>
            <ReactLoading type="cubes" color="#3f51b5" height={50} width={50} />
          </div>
        )}
        {!loading &&
          allblogs?.map((blog, i) => (
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
              handleLike={() => handleLike(blog._id)}
              handleUnlike={() => handleUnlike(blog._id)}
              postedBy={blog.postedBy}
            />
          ))}
      </div>
      <div className="home-right">
        <h2>Most Liked Blogs</h2>
        <RatedTable allblogs={allblogs} post />
      </div>
    </div>
  );
}

export default Home;
