import React, { useContext} from "react";
import CardBoard from "./CardBoard";
import PostsContext from "./PostsContext";
import styles from "../styles/postsStyles"

const Posts = () => {
  const { user } = useContext(PostsContext);
  const classes = styles();

  return (
    <div className={classes.posts}>
      {user.username &&
        <div>
          <h3>Create a post</h3>
          <form method='POST' action='http://localhost:5000/api/messages'>
            <input className='message input' type='text' name='message' placeholder="message" maxLength="64"></input>
            <button className="submit-btn" type='submit'> Submit </button>
          </form>
        </div>
      }
      <CardBoard />
    </div>
  )
};

export default Posts;
