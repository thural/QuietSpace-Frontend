import React, { useContext} from "react";
import { createUseStyles } from "react-jss";
import CardBoard from "./CardBoard";
import PostsContext from "./PostsContext";

const useStyle = createUseStyles({
  posts: {
    margin: 'auto',
    padding: '10vh 10vw',
  }
})
const Posts = () => {
  const { user } = useContext(PostsContext);
  const classes = useStyle();

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
