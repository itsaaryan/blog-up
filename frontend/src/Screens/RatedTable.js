import React from "react";
import { Link } from "react-router-dom";

function RatedTable({ allblogs, post }) {
  var sortBlog = [...allblogs];
  sortBlog.sort((a, b) => b.likes.length - a.likes.length);

  return (
    <div className="table">
      {sortBlog.map((blog) => (
        <tr>
          <td>
            <Link
              to={`/userprofile/${blog.postedBy._id}`}
              style={{ color: "#6a5d5d" }}
            >
              {post ? blog.title : blog.postedBy.name}
            </Link>
          </td>
          <td>
            <strong>
              {post
                ? blog.likes.length - blog.unlikes.length
                : blog.likes.length}
            </strong>
          </td>
        </tr>
      ))}
    </div>
  );
}

export default RatedTable;
