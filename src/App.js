import React, { useState, useEffect } from "react";
import "./App.css";
import Post from "./Post";
import Modal from "@material-ui/core/Modal";
import { makeStyles } from "@material-ui/core/styles";
import { db, auth } from "./Firebase";
import { Button, Input } from "@material-ui/core";
import ImageUpload from "./ImageUpload";

function getModalStyle() {
  const top = 50;
  const left = 50;

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

const useStyles = makeStyles((theme) => ({
  paper: {
    position: "absolute",
    width: 400,
    backgroundColor: theme.palette.background.paper,
    border: "2px solid #000",
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));

function App() {
  const classes = useStyles();
  const [modalStyle] = useState(getModalStyle);
  const [post, setPost] = useState([]);
  const [open, setOpen] = useState(false);
  const [openSignin, setOpenSignin] = useState(false);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      if (authUser) {
        //User has logged in
        console.log(authUser);
        setUser(authUser);
      } else {
        //user has logged out
        setUser(null);
      }
    });
    return () => {
      //perform some cleanup actions
      unsubscribe();
    };
  }, [user, username]);

  //useEffect runs a piece of code based on a specific condition.
  useEffect(() => {
    //this is where the code runs
    db.collection("post")
      .orderBy("timestamp", "desc")
      .onSnapshot((snapshot) => {
        //Every single time anew post is added the code is fired.
        setPost(
          snapshot.docs.map((doc) => ({
            id: doc.id,
            post: doc.data(),
          }))
        );
      });
  }, []);
  // the [] means the code run once when page is refreshed.

  const signUp = (event) => {
    event.preventDefault();
    auth
      .createUserWithEmailAndPassword(email, password)
      .then((authUser) => {
        return authUser.user.updateProfile({
          displayName: username,
        });
      })
      .catch((error) => alert(error.message));
    setOpen(false);
  };

  const signIn = (event) => {
    event.preventDefault();
    auth
      .signInWithEmailAndPassword(email, password)
      .catch((error) => alert(error.message));
    setOpenSignin(false);
  };

  return (
    <div className="App">
      <Modal open={open} onClose={() => setOpen(false)}>
        <div style={modalStyle} className={classes.paper}>
          <form className="app_signUp">
            <center>
              <img
                className="header_image"
                src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Instagram_logo.svg/1200px-Instagram_logo.svg.png"
                alt=""
              />
            </center>
            <Input
              placeholder="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <Input
              placeholder="email"
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Input
              placeholder="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button type="submit" onClick={signUp}>
              Sign Up
            </Button>
          </form>
        </div>
      </Modal>

      <Modal open={openSignin} onClose={() => setOpenSignin(false)}>
        <div style={modalStyle} className={classes.paper}>
          <form className="app_signUp">
            <center>
              <img
                className="header_image"
                src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Instagram_logo.svg/1200px-Instagram_logo.svg.png"
                alt=""
              />
            </center>
            <Input
              placeholder="email"
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Input
              placeholder="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button type="submit" onClick={signIn}>
              Sign In
            </Button>
          </form>
        </div>
      </Modal>

      <div className="app_header">
        <img
          className="header_image"
          src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Instagram_logo.svg/1200px-Instagram_logo.svg.png"
          alt=""
        />

        {user ? (
          <Button onClick={() => auth.signOut()}>
            <strong>Logout</strong>
          </Button>
        ) : (
          <div className="app_login">
            <Button onClick={() => setOpenSignin(true)}>
              <strong>Sign In</strong>
            </Button>
            <Button onClick={() => setOpen(true)}>
              <strong>Sign Up</strong>
            </Button>
          </div>
        )}
      </div>
      <div className="app_post">
        {post.map(({ id, post }) => (
          <Post
            key={id}
            user={user}
            postId={id}
            userName={post.username}
            caption={post.caption}
            imageUrl={post.imageUrl}
          />
        ))}
      </div>
      
      

      {user?.displayName ? (
        <ImageUpload username={user.displayName} />
      ) : (
        <h3 className="Sorry">Sorry you need to login before uploading.</h3>
      )}
    </div>
  );
}

export default App;
