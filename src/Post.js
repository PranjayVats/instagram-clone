import React, { useEffect, useState } from "react";
import "./Post.css";
import Avatar from "@material-ui/core/Avatar";
import firebase from "firebase/app";
import "firebase/firestore";
import { db } from "./Firebase";
function Post({ postId, user, userName, caption, imageUrl }) {
  const [comments, setComments] = useState([]);
  const [comment, setComment] = useState("");

  useEffect(() => {
    let unsubscribe;
    if (postId) {
      unsubscribe = db
        .collection("post")
        .doc(postId)
        .collection("comment")
        .onSnapshot((snapshot) => {
          setComments(snapshot.docs.map((doc) => doc.data()));
        });
    }
    return () => {
      //perform some cleanup actions
      unsubscribe();
    };
  }, [postId]);

  const postComment = (event) => {
    event.preventDefault();
    db.collection("post").doc(postId).collection("comment").add({
      username: user.displayName,
      comment: comment,
      timestamp: firebase.firestore.FieldValue.serverTimestamp() 
    });
    setComment('');
  };

  return (
    <div className="post">
      <div className="post_header">
        <Avatar
          className="post_avatar"
          src="/static/image/avatar/1.jpg"
          // This "src" will create avatar of First Letter of "alt" if no avatar is given.
          alt={userName}
        />
        <h3>{userName}</h3>
      </div>
      <img className="post_image" src={imageUrl} alt="" />
      <h4 className="post_text">
        <strong>{userName}</strong> {caption}
      </h4>
      <div className="post_comments">
        {comments.map((comment) => (
          <p>
            <strong>{comment.username}</strong> {comment.comment}
          </p>
        ))}
      </div>
      {user && (
        <form className="commentBox">
          <input
            className="post_input"
            placeholder="Add a comment..."
            type="text"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
          <button
            className="post_button"
            disabled={!comment}
            type="submit"
            onClick={postComment}
          >
            Post
          </button>
        </form>
      )}
    </div>
  );
}

export default Post;
