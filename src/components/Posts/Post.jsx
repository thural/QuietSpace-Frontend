import React, {useEffect, useState} from "react"
import styles from "./styles/postStyles"
import likeIcon from "../../assets/thumbs.svg"
import shareIcon from "../../assets/share.svg"
import editIcon from "../../assets/edit.svg"
import commentIcon from "../../assets/comment-3-line.svg"
import deleteIcon from "../../assets/delete-bin-line.svg"
import CommentSection from "./CommentSection"
import {useDispatch, useSelector} from "react-redux"
import {deletePost, loadComments} from "../../redux/postReducer"
import {edit} from "../../redux/formViewReducer"
import {fetchDeletePost, fetchLikePost} from "../../api/postRequests";
import {COMMENT_PATH, POST_LIKE_TOGGLE, POST_URL} from "../../constants/ApiPath";
import {fetchCommentsByPostId} from "../../api/commentRequests";

const Post = ({post}) => {
    const dispatch = useDispatch();
    const user = useSelector(state => state.userReducer);
    const auth = useSelector(state => state.authReducer);

    const {id: postId, username, text, likes} = post;
    const [showComments, setShowComments] = useState(false);
    const [isFetching, setIsFetching] = useState(true);

    const handleDeletePost = async (postId) => {
        try {
            const response = await fetchDeletePost(POST_URL, auth["token"], postId);
            if (response.ok) dispatch(deletePost({postId, user}));
        } catch (error) {
            console.log('error from delete post: ', error);
        }
    }

    const handlePostLikeToggle = async (postId, userId, token) => {
        try {
            const likeBody = {postId, userId};
            const response = await fetchLikePost(POST_LIKE_TOGGLE, likeBody, token);
            if (response.ok) console.log("like was toggled"); // TODO:  write a dispatch logic
        } catch (error) {
            console.log(`like toggle on comment with id: ${postId} was failed`);
        }
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
        handleLoadComments(postId, auth["token"]).then(() => {
                setIsFetching(false);
            }
        )
    }, []);

    const comments = post.comments;
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
                            <img src={likeIcon} onClick={() => handlePostLikeToggle(postId)} alt={"post like icon"}/>
                        }

                        <img src={commentIcon} onClick={() => setShowComments(!showComments)} alt={"comment icon"}/>

                        {
                            post.username === user.username &&
                            <img src={editIcon} onClick={() => dispatch(edit({view: true, _id: postId}))}
                                 alt={"edit icon"}/>
                        }

                        <img src={shareIcon} alt={"share icon"}/>

                        {
                            user.role === "admin" || post.username === user.username &&
                            <img src={deleteIcon} onClick={() => handleDeletePost(postId)} alt={"delete post icon"}/>
                        }
                    </div>

                    {
                        !isFetching && showComments &&
                        <CommentSection postId={postId} comments={comments}/>
                    }
                </>
            }
        </div>
    )
}

export default Post