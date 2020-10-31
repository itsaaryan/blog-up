import React, { useContext, useState } from "react";
import EmailRoundedIcon from "@material-ui/icons/EmailRounded";
import LockRoundedIcon from "@material-ui/icons/LockRounded";
import { useHistory } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./Signin.css";
import { UserContext } from "../App";

function Signin() {
  const [email, setemail] = useState("");
  const [password, setpassword] = useState("");
  const history = useHistory();
  const { state, dispatch } = useContext(UserContext);

  const signIn = (e) => {
    e.preventDefault();
    if (!email || !password) {
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
    fetch("/auth/signin", {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        password,
      }),
    })
      .then((res) => res.json())
      .then((result) => {
        console.log(result);

        if (result.success) {
          toast.success(result.success, {
            position: "top-right",
            autoClose: 4000,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: 0,
          });
          localStorage.setItem("jwt", JSON.stringify(result.token));
          localStorage.setItem("user", JSON.stringify(result.user));
          dispatch({ type: "USER_SIGNIN", payload: result.user });
          history.push("/");
        } else {
          toast.error(result.err, {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: 0,
          });
          setemail("");
          setpassword("");
        }
      })
      .catch((err) => console.log(err));
  };
  return (
    <div className="signin">
      <h2>Blog-Up</h2>
      <div className="signin-container">
        <form>
          <div className="login-place-icon">
            <EmailRoundedIcon />
          </div>

          <input
            type="text"
            placeholder="Email"
            value={email}
            onChange={(e) => setemail(e.target.value)}
          ></input>

          <div className="login-place-icon">
            <LockRoundedIcon />
          </div>
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setpassword(e.target.value)}
          ></input>
          <small>Forgot password ?</small>
          <button className="signin-button" onClick={signIn}>
            Sign-In
          </button>
          <p>Don't have a account ?</p>
          <button
            className="signin-createaccount-btn"
            onClick={() => history.replace("/signup")}
          >
            Sign-Up
          </button>
        </form>
      </div>
    </div>
  );
}

export default Signin;
