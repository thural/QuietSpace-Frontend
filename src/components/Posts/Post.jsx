import React, {useEffect, useState} from "react"
import styles from "./styles/postStyles"
import likeIcon from "../../assets/thumbs.svg"
import shareIcon from "../../assets/share.svg"
import editIcon from "../../assets/edit.svg"
import commentIcon from "../../assets/comment-3-line.svg"
import deleteIcon from "../../assets/delete-bin-line.svg"
import CommentSection from "./CommentSection"
import {useDispatch, useSelector} from "react-redux"
import {deletePost, likePost, loadComments} from "../../redux/postReducer"
import {edit} from "../../redux/formViewReducer"
import {fetchDeletePost} from "../../api/postRequests";
import {COMMENT_PATH, POST_URL} from "../../constants/ApiPath";
import {fetchCommentsByPostId} from "../../api/commentRequests";

const Post = ({post}) => {
    const dispatch = useDispatch();
    const user = useSelector(state => state.userReducer);
    const auth = useSelector(state => state.authReducer);
    const posts = useSelector(state => state.postReducer);

    const {id: postId, username, text, likes} = post;
    const [active, setActive] = useState(false);
    const [isFetching, setIsFetching] = useState(true);

    const handleDeletePost = async (postId) => {
        try {
            const response = await fetchDeletePost(POST_URL, auth.token, postId);
            if (response.ok) dispatch(deletePost({postId, user}));
        } catch (error) {
            console.log('error from delete post: ', error);
        }
    }

    const handleLikePost = async (postId) => {
        await fetch(`http://localhost:5000/api/posts/like/${postId}`, {method: 'POST'})
            .then(res => res.json())
            .then(() => {
                dispatch(likePost({_id: postId, user}))
            })
            .catch(err => console.log('error from like post: ', err))
    }

    const handleLoadComments = async (postId, token) => {
        try {
            const response = await fetchCommentsByPostId(COMMENT_PATH + `/post/${postId}`, token);
            const responseData = await response.json();
            if (response.ok) dispatch(loadComments({comments: responseData.content, postId: postId}));
        } catch (error) {
            console.log(`error on loading comments for post with id ${postId}: `, error)
        }
    }

    useEffect(() => {
        handleLoadComments(postId, auth.token).then(() => {
                setIsFetching(false);
            }
        )
    }, []);

    const comments = posts.find(post => post.id === postId).comments;

    const classes = styles();

    return (
        <div id={postId} className={classes.wrapper}>
            <div className="author">{username}</div>
            <div className="text"><p>{text}</p></div>
            <div className={classes.postinfo}>
                <p className="likes">{likes == null ? 0 : likes.length} likes</p>
                <p>{comments == null ? 0 : comments.length} comments </p>
                <p>0 shares</p>
            </div>

            {
                user.username &&
                <>
                    <hr></hr>
                    <div className="panel">
                        {
                            post.username !== user.username &&
                            <img src={likeIcon} onClick={() => handleLikePost(postId)}/>
                        }

                        <img src={commentIcon} onClick={() => setActive(!active)}/>

                        {
                            post.username === user.username &&
                            <img src={editIcon} onClick={() => dispatch(edit({view: true, _id: postId}))}/>
                        }

                        <img src={shareIcon}/>

                        {
                            user.admin || post.username === user.username &&
                            <img src={deleteIcon} onClick={() => handleDeletePost(postId)}/>
                        }
                    </div>
                    {
                        !isFetching && active &&
                        <CommentSection postId={postId} comments={comments}/>
                    }
                </>
            }
        </div>
    )
}

export default Post