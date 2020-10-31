import React, { useContext, useState } from "react";
import "./Blog.css";
import moment from "moment";
import ThumbUpAltIcon from "@material-ui/icons/ThumbUpAlt";
import ThumbDownAltIcon from "@material-ui/icons/ThumbDownAlt";
import QuestionAnswerIcon from "@material-ui/icons/QuestionAnswer";
import { IconButton, Modal } from "@material-ui/core";
import { UserContext } from "../App";
import SendIcon from "@material-ui/icons/Send";
import { Link, useHistory } from "react-router-dom";
import DeleteIcon from "@material-ui/icons/Delete";
import { toast } from "react-toastify";

function Blog({
  _id,
  title,
  content,
  image,
  created,
  likes,
  unlikes,
  handleLike,
  handleUnlike,
  comments,
  accountholder,
  postedBy,
}) {
  const { state, dispatch } = useContext(UserContext);
  const [open, setOpen] = React.useState(false);
  const [comment, setComment] = useState("");
  const history = useHistory();

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleComments = (e) => {
    e.preventDefault();
    fetch("/posts/comment", {
      method: "put",
      headers: {
        "Content-Type": "application/json",
        //prettier-ignore
        "Authorization":"Bearer "+JSON.parse(localStorage.getItem("jwt")),
      },
      body: JSON.stringify({
        _id,
        comment: comment,
      }),
    })
      .then((res) => res.json())
      .then((result) => {
        console.log(result);
        setComment("");
        window.location.reload(false);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const deletePost = () => {
    fetch(`/posts/delete/${_id}`, {
      method: "delete",
      headers: {
        Authorization: "Bearer " + JSON.parse(localStorage.getItem("jwt")),
      },
    })
      .then((res) => {
        toast.success("Blog deleted successfully", {
          position: "top-right",
          autoClose: 4000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: 0,
        });
        window.location.reload(false);
      })
      .catch((err) => console.log(err));
  };

  return (
    <>
      <div className="blog-container">
        <div className="blog">
          <div className="blog-left">
            <img src={image}></img>
          </div>
          <div className="blog-right">
            <Link
              to={`/userprofile/${postedBy?._id}`}
              style={{ color: "black" }}
            >
              <h2>{title}</h2>
            </Link>
            <small>{moment(created).format("MMMM Do YYYY")}</small>
            <p>{content}</p>
            <p
              className="blog-p-extend"
              onClick={handleOpen}
              style={{ cursor: "pointer" }}
            >
              ...Continue Reading
            </p>
          </div>
        </div>
        <hr></hr>
        <div className="blog-like">
          <div>
            <IconButton
              onClick={(e) => !likes.includes(state.user?._id) && handleLike()}
            >
              <ThumbUpAltIcon />
            </IconButton>
            <b>{likes?.length}</b>
          </div>
          <div>
            <IconButton
              onClick={(e) =>
                !unlikes.includes(state.user?._id) && handleUnlike()
              }
            >
              <ThumbDownAltIcon />
            </IconButton>
            <b>{unlikes?.length}</b>
          </div>

          <IconButton onClick={handleOpen}>
            <QuestionAnswerIcon />
          </IconButton>
          {accountholder && (
            <IconButton onClick={deletePost}>
              <DeleteIcon />
            </IconButton>
          )}
        </div>
      </div>
      <Modal
        className="blog-modal"
        open={open}
        onClose={handleClose}
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
      >
        <>
          <div className="modal-container">
            <div className="modal-header">
              <h2>{title}</h2>
              <small>{moment(created).format("MMMM Do YYYY")}</small>
            </div>
            <div className="modal-image">
              <img src={image}></img>
            </div>
            <div className="modal-content">
              <h3>Description</h3>
              <p>{content}</p>
            </div>
            <div className="modal-comment">
              <h3>Comments</h3>
              {comments?.map((comment, i) => (
                <div key={i}>
                  <img src={comment.postedBy.image}></img>
                  <p>{comment.postedBy?.name}</p>
                  <small>{comment.comment}</small>
                </div>
              ))}
            </div>
          </div>
          <div className="comment-input">
            <div>
              <input
                type="text"
                placeholder="Comment"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              ></input>
              <IconButton onClick={handleComments}>
                <SendIcon />
              </IconButton>
            </div>
          </div>
        </>
      </Modal>
    </>
  );
}

export default Blog;
