import React, { useContext } from "react";
import { fade, makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";
import InputBase from "@material-ui/core/InputBase";
import Badge from "@material-ui/core/Badge";
import MenuItem from "@material-ui/core/MenuItem";
import Menu from "@material-ui/core/Menu";
import BookIcon from "@material-ui/icons/Book";
import SearchIcon from "@material-ui/icons/Search";
import AccountCircle from "@material-ui/icons/AccountCircle";
import NotificationsIcon from "@material-ui/icons/Notifications";
import MoreIcon from "@material-ui/icons/MoreVert";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import LockOpenRoundedIcon from "@material-ui/icons/LockOpenRounded";
import Tooltip from "@material-ui/core/Tooltip";
import { Link } from "react-router-dom";
import "./Navbar.css";
import { UserContext } from "../App";

const useStyles = makeStyles((theme) => ({
  grow: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    display: "none",
    [theme.breakpoints.up("sm")]: {
      display: "block",
    },
  },
  search: {
    position: "relative",
    borderRadius: theme.shape.borderRadius,
    backgroundColor: fade(theme.palette.common.white, 0.15),
    "&:hover": {
      backgroundColor: fade(theme.palette.common.white, 0.25),
    },
    marginRight: theme.spacing(2),
    marginLeft: 0,
    width: "100%",
    [theme.breakpoints.up("sm")]: {
      marginLeft: theme.spacing(3),
      width: "auto",
    },
  },
  searchIcon: {
    padding: theme.spacing(0, 2),
    height: "100%",
    position: "absolute",
    pointerEvents: "none",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  inputRoot: {
    color: "inherit",
  },
  inputInput: {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
    transition: theme.transitions.create("width"),
    width: "100%",
    [theme.breakpoints.up("md")]: {
      width: "20ch",
    },
  },
  sectionDesktop: {
    display: "none",
    [theme.breakpoints.up("md")]: {
      display: "flex",
    },
  },
  sectionMobile: {
    display: "flex",
    [theme.breakpoints.up("md")]: {
      display: "none",
    },
  },
}));

export default function Navbar() {
  const { state, dispatch } = useContext(UserContext);
  console.log(state);
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = React.useState(null);

  const isMenuOpen = Boolean(anchorEl);
  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMobileMenuClose = () => {
    setMobileMoreAnchorEl(null);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    handleMobileMenuClose();
  };

  const handleMobileMenuOpen = (event) => {
    setMobileMoreAnchorEl(event.currentTarget);
  };

  const menuId = "primary-search-account-menu";
  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{ vertical: "top", horizontal: "right" }}
      id={menuId}
      keepMounted
      transformOrigin={{ vertical: "top", horizontal: "right" }}
      open={isMenuOpen}
      onClose={handleMenuClose}
    >
      <Link to="/profile" className="navbar-mobile-link">
        <MenuItem onClick={handleMenuClose}>Profile</MenuItem>
      </Link>
      <Link to="/updateprofile" className="navbar-mobile-link">
        <MenuItem onClick={handleMenuClose}>Edit Profile</MenuItem>
      </Link>

      <Link to="/create" className="navbar-mobile-link">
        <MenuItem onClick={handleMenuClose}>Create Blog</MenuItem>
      </Link>

      <MenuItem
        onClick={() => {
          localStorage.removeItem("user");
          dispatch({ type: "USER_SIGNOUT" });
          window.location.reload(false);
          return handleMenuClose();
        }}
      >
        Log Out
      </MenuItem>
    </Menu>
  );

  const mobileMenuId = "primary-search-account-menu-mobile";
  const renderMobileMenu = (
    <Menu
      anchorEl={mobileMoreAnchorEl}
      anchorOrigin={{ vertical: "top", horizontal: "right" }}
      id={mobileMenuId}
      keepMounted
      transformOrigin={{ vertical: "top", horizontal: "right" }}
      open={isMobileMenuOpen}
      onClose={handleMobileMenuClose}
    >
      {!state?.user && (
        <MenuItem>
          <Link to="/signin" className="navbar-mobile-link">
            <IconButton aria-label="show 4 new mails" color="inherit">
              <ExitToAppIcon />
            </IconButton>
          </Link>
          <Link to="/signin" className="navbar-mobile-link">
            <p>Sign-In</p>
          </Link>
        </MenuItem>
      )}
      {!state?.user && (
        <MenuItem>
          <Link to="/signup" className="navbar-mobile-link">
            <IconButton aria-label="show 4 new mails" color="inherit">
              <LockOpenRoundedIcon />
            </IconButton>
          </Link>
          <Link to="/signup" className="navbar-mobile-link">
            <p>Sign-Up</p>
          </Link>
        </MenuItem>
      )}
      {state?.user && (
        <MenuItem>
          <IconButton aria-label="show 11 new notifications" color="inherit">
            <Badge badgeContent={11} color="secondary">
              <NotificationsIcon />
            </Badge>
          </IconButton>
          <p>Notifications</p>
        </MenuItem>
      )}
      {state?.user && (
        <MenuItem onClick={handleProfileMenuOpen}>
          <IconButton
            aria-label="account of current user"
            aria-controls="primary-search-account-menu"
            aria-haspopup="true"
            color="inherit"
          >
            <AccountCircle />
          </IconButton>
          <p>Account</p>
        </MenuItem>
      )}
    </Menu>
  );

  return (
    <div className={classes.grow}>
      <AppBar position="static">
        <Toolbar>
          <div
            style={{
              display: "flex",
              marginTop: "auto",
              marginBottom: "auto",
            }}
          >
            {state?.user ? (
              <Link to="/" className="navbar-desktop-link nav-header-link">
                <BookIcon />
              </Link>
            ) : (
              <div className="nav-header-link">
                <BookIcon />
              </div>
            )}
            &nbsp;&nbsp;
            <Typography className={classes.title} variant="h6" noWrap>
              {state?.user ? (
                <Link to="/" className="navbar-desktop-link nav-header-link">
                  Blog-Up
                </Link>
              ) : (
                "Blog-Up"
              )}
            </Typography>
          </div>
          <div className={classes.search}>
            <div className={classes.searchIcon}>
              <SearchIcon />
            </div>
            <InputBase
              placeholder="Search…"
              classes={{
                root: classes.inputRoot,
                input: classes.inputInput,
              }}
              inputProps={{ "aria-label": "search" }}
            />
          </div>
          <div className={classes.grow} />
          <div className={classes.sectionDesktop}>
            {!state?.user && (
              <Tooltip title="Sign-In">
                <Link to="/signin" className="navbar-desktop-link">
                  <IconButton aria-label="show 4 new mails" color="inherit">
                    <ExitToAppIcon />
                  </IconButton>
                </Link>
              </Tooltip>
            )}
            {!state?.user && (
              <Tooltip title="Sign-up">
                <Link to="/signup" className="navbar-desktop-link">
                  <IconButton aria-label="show 4 new mails" color="inherit">
                    <LockOpenRoundedIcon />
                  </IconButton>
                </Link>
              </Tooltip>
            )}
            {state.user && (
              <Tooltip title="Notifications">
                <IconButton
                  aria-label="show 17 new notifications"
                  color="inherit"
                >
                  <Badge badgeContent={17} color="secondary">
                    <NotificationsIcon />
                  </Badge>
                </IconButton>
              </Tooltip>
            )}
            {state?.user && (
              <Tooltip title="Profile">
                <IconButton
                  edge="end"
                  aria-label="account of current user"
                  aria-controls={menuId}
                  aria-haspopup="true"
                  onClick={handleProfileMenuOpen}
                  color="inherit"
                >
                  <AccountCircle />
                </IconButton>
              </Tooltip>
            )}
          </div>
          <div className={classes.sectionMobile}>
            <IconButton
              aria-label="show more"
              aria-controls={mobileMenuId}
              aria-haspopup="true"
              onClick={handleMobileMenuOpen}
              color="inherit"
            >
              <MoreIcon />
            </IconButton>
          </div>
        </Toolbar>
      </AppBar>
      {renderMobileMenu}
      {renderMenu}
    </div>
  );
}
