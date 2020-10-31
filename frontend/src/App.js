import React, { createContext, useContext, useEffect, useReducer } from "react";
import "./App.css";
import {
  BrowserRouter as Router,
  Route,
  Switch,
  useHistory,
} from "react-router-dom";
import Navbar from "./Components/Navbar";
import Signin from "./Screens/Signin";
import Home from "./Screens/Home";
import Signup from "./Screens/Signup";
import CreateBlog from "./Screens/CeateBlog";
import { ToastContainer } from "react-toastify";
import Profile from "./Screens/Profile";
import reducer, { initialState } from "./reducer/userReducer";
import UserProfile from "./Screens/UserProfile";
import UpdateProfile from "./Screens/UpdateProfile";

export const UserContext = createContext();

const Routing = () => {
  const history = useHistory();
  const { state, dispatch } = useContext(UserContext);
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) {
      dispatch({ type: "USER_SIGNIN", payload: user });
    } else {
      dispatch({ type: "USER_SIGNOUT" });
      history.push("/signin");
    }
    return () => {
      //
    };
  }, []);

  return (
    <Switch>
      <Route path="/updateprofile" exact>
        <UpdateProfile />
      </Route>
      <Route path="/userprofile/:id" exact>
        <UserProfile />
      </Route>
      <Route path="/create" exact>
        <CreateBlog />
      </Route>
      <Route path="/profile" exact>
        <Profile />
      </Route>
      <Route path="/signup" exact>
        <Signup />
      </Route>
      <Route path="/signin" exact>
        <Signin />
      </Route>
      <Route path="/" exact>
        <Home />
      </Route>
    </Switch>
  );
};

function App() {
  const [state, dispatch] = useReducer(reducer, initialState);
  return (
    <UserContext.Provider value={{ state, dispatch }}>
      <Router>
        <div className="app">
          <Navbar />
          <Routing />
          <ToastContainer
            position="top-right"
            autoClose={4000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
          />
        </div>
      </Router>
    </UserContext.Provider>
  );
}

export default App;
