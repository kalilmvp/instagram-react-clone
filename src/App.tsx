import {
  Button,
  createStyles,
  Input,
  makeStyles,
  Modal,
  Theme,
} from "@material-ui/core";
import { User } from "firebase";
import React, { FormEvent, useCallback, useEffect, useState } from "react";
import InstagramEmbed from "react-instagram-embed";
import "./App.css";
import Post from "./components/Post";
import PostUpload from "./components/PostUpload";
import { auth, db } from "./utils/firebase";

interface PostData {
  userName: string;
  caption: string;
  imageUrl: string;
}

interface PostListData {
  id: string;
  post: PostData;
}

const App: React.FC = () => {
  const [posts, setPosts] = useState<PostListData[]>([]);
  const [open, setOpen] = useState(false);
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loggedInUser, setLoggedInUser] = useState<User>({} as User);
  const [openSignIn, setOpenSignIn] = useState(false);
  const [modalStyle] = React.useState(getModalStyle);

  const useStyles = makeStyles((theme: Theme) =>
    createStyles({
      paper: {
        position: "absolute",
        width: 400,
        backgroundColor: theme.palette.background.paper,
        border: "2px solid #000",
        boxShadow: theme.shadows[5],
        padding: theme.spacing(2, 4, 3),
      },
    })
  );

  const classes = useStyles();

  function getModalStyle() {
    const top = 50;
    const left = 50;

    return {
      top: `${top}%`,
      left: `${left}%`,
      transform: `translate(-${top}%, -${left}%)`,
    };
  }

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      if (authUser) {
        // user has logged in
        setLoggedInUser(authUser);
      } else {
        // user has logged out
        setLoggedInUser({} as User);
      }
    });

    return () => {
      unsubscribe();
    };
  }, [userName]);

  useEffect(() => {
    db.collection("posts")
      .orderBy("timestamp", "desc")
      .onSnapshot((snapshot) => {
        setPosts(
          snapshot.docs.map((doc) => {
            return {
              id: doc.id,
              post: doc.data(),
            } as PostListData;
          })
        );
      });
  }, []);

  const handleOpenSigninModal = useCallback(() => {
    setOpenSignIn(true);
  }, []);

  const handleOpenSignupModal = useCallback(() => {
    setOpen(true);
  }, []);

  const handleOpenSignout = useCallback(() => {
    return auth.signOut();
  }, []);

  const handleSignup = useCallback(
    (e: FormEvent) => {
      e.preventDefault();
      auth
        .createUserWithEmailAndPassword(email, password)
        .then((resp) => {
          // in case we don´t have the display name, it´s a new user so update the
          // profile with the username
          if (resp.user) {
            if (!resp.user.displayName) {
              return resp.user
                .updateProfile({
                  displayName: userName,
                })
                .then(() => setOpen(false));
            }
          }
        })
        .catch((error) => {
          alert(error.message);
        });
    },
    [userName, email, password]
  );

  const handleSignin = useCallback(
    (e: FormEvent) => {
      e.preventDefault();

      return auth
        .signInWithEmailAndPassword(email, password)
        .then((response) => {
          const user = response.user;
          if (user) {
            setLoggedInUser(user);
            setOpenSignIn(false);
          }
        })
        .catch((error) => {
          alert(error.message);
        });
    },
    [email, password]
  );

  return (
    <div className="app">
      <Modal open={open} onClose={() => setOpen(false)}>
        <div style={modalStyle} className={classes.paper}>
          <form>
            <div className="app__signup_header">
              <img
                className="app__signup_headerImage"
                src="https://www.instagram.com/static/images/web/mobile_nav_type_logo-2x.png/1b47f9d0e595.png"
                alt="Instagram"
              />
            </div>
            <div className="app__signup">
              <Input
                placeholder="Username"
                type="text"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
              />
              <Input
                placeholder="Email"
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <Input
                placeholder="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <Button type="submit" onClick={handleSignup}>
                Signup
              </Button>
            </div>
          </form>
        </div>
      </Modal>

      <Modal open={openSignIn} onClose={() => setOpenSignIn(false)}>
        <div style={modalStyle} className={classes.paper}>
          <form>
            <div className="app__signup_header">
              <img
                className="app__signup_headerImage"
                src="https://www.instagram.com/static/images/web/mobile_nav_type_logo-2x.png/1b47f9d0e595.png"
                alt="Instagram"
              />
            </div>
            <div className="app__signup">
              <Input
                placeholder="Email"
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <Input
                placeholder="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <Button type="submit" onClick={handleSignin}>
                Signin
              </Button>
            </div>
          </form>
        </div>
      </Modal>
      {/* Header*/}
      <div className="app__header">
        <img
          className="app__headerImage"
          src="https://www.instagram.com/static/images/web/mobile_nav_type_logo-2x.png/1b47f9d0e595.png"
          alt="Instagram"
        />
        {loggedInUser.uid ? (
          <>
            <h3>Hey user {loggedInUser.displayName}</h3>
            <Button onClick={handleOpenSignout}>Logout</Button>
          </>
        ) : (
          <div className="app_loginContainer">
            <Button onClick={handleOpenSigninModal}>Signin</Button>
            <Button onClick={handleOpenSignupModal}>Signup</Button>
          </div>
        )}
      </div>

      {/* Posts */}
      <div className="app__post">
        <div className="app__postsLeft">
          {posts.map((postList) => (
            <Post
              key={postList.id}
              data={{
                id: postList.id,
                userName: postList.post.userName,
                caption: postList.post.caption,
                imageUrl: postList.post.imageUrl,
              }}
              loggedUser={loggedInUser.displayName}
            />
          ))}
        </div>
        <div className="app__postsRight">
          <InstagramEmbed
            url="https://instagr.am/p/Zw9o4/"
            maxWidth={320}
            hideCaption={false}
            containerTagName="div"
            protocol=""
            injectScript
            onLoading={() => {}}
            onSuccess={() => {}}
            onAfterRender={() => {}}
            onFailure={() => {}}
          />
        </div>
      </div>

      {loggedInUser?.displayName ? (
        <PostUpload userName={loggedInUser.displayName} />
      ) : (
        <h3>Sorry you need to Login</h3>
      )}
      {/* Post*/}
    </div>
  );
};

export default App;
