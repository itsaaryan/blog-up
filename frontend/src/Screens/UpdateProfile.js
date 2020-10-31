import React, { useContext, useState } from "react";
import EmailRoundedIcon from "@material-ui/icons/EmailRounded";
import LockRoundedIcon from "@material-ui/icons/LockRounded";
import CameraAltRoundedIcon from "@material-ui/icons/CameraAltRounded";
import { useHistory } from "react-router-dom";
import AccountCircleRoundedIcon from "@material-ui/icons/AccountCircleRounded";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./Signup.css";
import { IconButton } from "@material-ui/core";
import { UserContext } from "../App";

function UpdateProfile() {
  const { state, dispatch } = useContext(UserContext);
  const [name, setname] = useState(state.user?.name);
  const [profileImg, setprofileImg] = useState(state.user?.image);
  const history = useHistory();

  const updateProfile = (e) => {
    e.preventDefault();
    console.log(e.target.files[0]);
    if (e.target.files[0]) {
      const data = new FormData();
      data.append("file", e.target.files[0]);
      data.append("upload_preset", "insta-clone");
      data.append("cloud_name", "dsxeglxhm");

      fetch("	https://api.cloudinary.com/v1_1/dsxeglxhm/image/upload", {
        method: "post",
        body: data,
      })
        .then((res) => res.json())
        .then((data) => {
          setprofileImg(data.url);
          console.log(profileImg);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  const setprofile = (e) => {
    e.preventDefault();
    if (!name) {
      toast.error("Please enter all the fields", {
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

    fetch("/user/updateprofile", {
      method: "post",
      headers: {
        "Content-Type": "application/json",
        //prettier-ignore
        "Authorization":"Bearer "+JSON.parse(localStorage.getItem("jwt")),
      },
      body: JSON.stringify({
        name,
        image: profileImg ? profileImg : undefined,
      }),
    })
      .then((res) => res.json())
      .then((result) => {
        console.log(result);
        toast.success("Profile updated successfully", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: 0,
        });
        dispatch({ type: "UPDATE_PROFILE", payload: result });
        localStorage.removeItem("user");
        localStorage.setItem("user", JSON.stringify(result));
        history.replace("/profile");
      })
      .catch((err) => console.log(err));
  };

  return (
    <div className="signup">
      <h2>Blog-Up</h2>
      <div className="signup-container">
        <form>
          <div class="placeImage">
            <img
              src={
                profileImg
                  ? profileImg
                  : "https://dcpcsb.org/themes/copycat/images/profile.png"
              }
              className="setImage"
            ></img>
            <label for="profileImg" className="profileImgIcon">
              <input
                type="file"
                id="profileImg"
                name="profileImg"
                style={{ display: "none" }}
                onChange={updateProfile}
              ></input>
              <div style={{ marginTop: "5px", padding: "2px 6px" }}>
                <CameraAltRoundedIcon />
              </div>
            </label>
          </div>
          <div className="signup-place-icon">
            <AccountCircleRoundedIcon />
          </div>
          <input
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setname(e.target.value)}
          ></input>
          <button className="signup-button" onClick={setprofile}>
            Update Profile
          </button>
        </form>
      </div>
    </div>
  );
}

export default UpdateProfile;
