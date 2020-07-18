import React, { useState, useEffect, useCallback, FormEvent } from "react";
import { Avatar, Input, Button } from "@material-ui/core";
import firebase from "firebase";
import avatar from "../../assets/avatar.png";

import "./styles.css";
import { db } from "../../utils/firebase";

interface PostProps {
  id: string;
  userName: string;
  caption: string;
  imageUrl: string;
}

interface PostDataProps {
  data: PostProps;
  loggedUser: string | null;
}

interface IComment {
  description: string;
  userName: string;
}

const Post: React.FC<PostDataProps> = ({ data, loggedUser }) => {
  const [comment, setComment] = useState<string>("");
  const [comments, setComments] = useState<IComment[]>([]);

  useEffect(() => {
    if (data.id) {
      db.collection("posts")
        .doc(data.id)
        .collection("comments")
        .orderBy("timestamp", "desc")
        .onSnapshot((snapShot) => {
          setComments(snapShot.docs.map((doc) => doc.data() as IComment));
        });
    }
  }, [data.id]);

  const handleOnSubmitComment = useCallback(
    (e: FormEvent) => {
      e.preventDefault();

      db.collection("posts")
        .doc(data.id)
        .collection("comments")
        .add({
          userName: loggedUser,
          description: comment,
          timestamp: firebase.firestore.FieldValue.serverTimestamp(),
        })
        .then((resp) => setComment(""))
        .catch((err) => alert(err.message));
    },
    [comment, data.id, loggedUser]
  );

  return (
    <div className="post">
      {/* header -> avatar and username */}
      <div className="post__header">
        <Avatar className="post__avatar" src={avatar} />
        <h3>{data.userName}</h3>
      </div>

      {/* image */}
      <img className="post__image" src={data.imageUrl} />
      {/* username + caption */}
      <h4 className="post__text">
        <strong>{data.userName}: </strong>
        {data.caption}
      </h4>

      <div className="post__comments">
        {comments.map((comment) => (
          <p>
            <strong>{comment.userName}</strong> {comment.description}
          </p>
        ))}
      </div>

      {loggedUser && (
        <form className="post__commentForm">
          <Input
            className="post__input"
            type="text"
            placeholder="Add a comment..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
          <Button
            disabled={!comment}
            type="submit"
            onClick={handleOnSubmitComment}
            variant="outlined"
            color="primary"
          >
            Comment
          </Button>
        </form>
      )}
    </div>
  );
};

export default Post;
