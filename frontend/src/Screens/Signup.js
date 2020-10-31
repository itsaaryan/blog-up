import React, { useState } from "react";
import EmailRoundedIcon from "@material-ui/icons/EmailRounded";
import LockRoundedIcon from "@material-ui/icons/LockRounded";
import CameraAltRoundedIcon from "@material-ui/icons/CameraAltRounded";
import { useHistory } from "react-router-dom";
import AccountCircleRoundedIcon from "@material-ui/icons/AccountCircleRounded";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./Signup.css";
import { IconButton } from "@material-ui/core";

function Signup() {
  const [email, setemail] = useState("");
  const [password, setpassword] = useState("");
  const [name, setname] = useState("");
  const [repass, setrepass] = useState("");
  const [profileImg, setprofileImg] = useState("");
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

  const signUp = (e) => {
    e.preventDefault();
    if (password !== repass) {
      toast.error("Passwords did not match", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: 0,
      });
      setpassword("");
      setrepass("");
      return;
    }
    if (!email || !name || !password) {
      toast.error("Please enter all the fields", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: 0,
      });
      setpassword("");
      setrepass("");
      return;
    }
    if (
      !/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
        email
      )
    ) {
      toast.error("Invalid email", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: 0,
      });
      setpassword("");
      setrepass("");
      setemail("");
      return;
    }
    fetch("/auth/signup", {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        name,
        password,
        image: profileImg ? profileImg : undefined,
      }),
    })
      .then((res) => res.json())
      .then((result) => {
        console.log(result);
        toast.success("User Signed-Up successfully", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: 0,
        });
        history.replace("/signin");
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
          <div className="signup-place-icon">
            <EmailRoundedIcon />
          </div>
          <input
            type="text"
            placeholder="Email"
            value={email}
            onChange={(e) => setemail(e.target.value)}
          ></input>
          <div className="signup-place-icon">
            <LockRoundedIcon />
          </div>
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setpassword(e.target.value)}
          ></input>
          <div className="signup-place-icon">
            <LockRoundedIcon />
          </div>
          <input
            type="password"
            placeholder="Re-enter Password"
            value={repass}
            onChange={(e) => setrepass(e.target.value)}
          ></input>
          <small>Forgot password ?</small>
          <button className="signup-button" onClick={signUp}>
            Sign-Up
          </button>
          <p>Already have a account ?</p>
          <button
            className="signup-createaccount-btn"
            onClick={() => history.replace("/signin")}
          >
            Sign-In
          </button>
        </form>
      </div>
    </div>
  );
}

export default Signup;
