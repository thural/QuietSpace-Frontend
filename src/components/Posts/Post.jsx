import React, { useEffect, useState } from "react"
import styles from "./styles/postStyles"
import likeIcon from "../../assets/thumbs.svg"
import shareIcon from "../../assets/share.svg"
import editIcon from "../../assets/edit.svg"
import commentIcon from "../../assets/comment-3-line.svg"
import deleteIcon from "../../assets/delete-bin-line.svg"
import CommentSection from "./CommentSection"
import { useDispatch, useSelector } from "react-redux"
import { deletePost, loadComments } from "../../redux/postReducer"
import { edit } from "../../redux/formViewReducer"
import { fetchDeletePost, fetchLikePost } from "../../api/postRequests";
import { COMMENT_PATH, POST_LIKE_TOGGLE, POST_URL } from "../../constants/ApiPath";
import { fetchCommentsByPostId } from "../../api/commentRequests";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

const Post = ({ post }) => {
    const dispatch = useDispatch();
    const user = useSelector(state => state.userReducer);
    const auth = useSelector(state => state.authReducer);

    const { id: postId, username, text, likes } = post;
    const [showComments, setShowComments] = useState(false);
    const queryClient = useQueryClient();


    const deletePostMutation = useMutation({
        mutationFn: async () => {
            const response = await fetchDeletePost(POST_URL, auth["token"], postId);
            return response.json();
        },
        onSuccess: (data, variables, context) => {
            queryClient.invalidateQueries(["posts"], { exact: true });
            dispatch(deletePost({ postId, user }));
            console.log("delete post sucess");
        },
        onError: (error, variables, context) => {
            console.log("error on deleting post: ", error.message)
        },
    })


    const handleDeletePost = async () => {
        deletePostMutation.mutate();
    }


    const toggleLikeMutation = useMutation({
        mutationFn: async () => {
            const likeBody = { postId }; // TODO: provide user id
            const response = await fetchLikePost(POST_LIKE_TOGGLE, likeBody, token);
            return response.json();
        },
        onSuccess: (data, variables, context) => {
            queryClient.invalidateQueries(["posts", { id: postId }]);
            console.log("post like toggle sucess");
        },
        onError: (error, variables, context) => {
            console.log("error on deleting post: ", error.message)
        },
    })


    const handlePostLikeToggle = async () => {
        toggleLikeMutation.mutate();
    }


    const commentsQuery = useQuery({
        queryKey: ["posts"],
        queryFn: async () => {
            const response = await fetchCommentsByPostId(COMMENT_PATH + `/post/${postId}`, auth["token"]);
            return await response.json();
        },
        onSuccess: (data) => {
            dispatch(loadComments({ comments: data.content, postId: postId }));
        },
        onError: () => {
            console.log(`error on loading comments for post with id ${postId}: `, error);
        },
        staleTime: 1000 * 60 * 6, // keep data fresh up to 6 minutes
        refetchInterval: 1000 * 60 * 3 // refetch data after 6 minutes on idle
    })


    const comments = commentsQuery.isFetched ? commentsQuery.data : [];
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

            <hr></hr>

            <div className="panel">
                {
                    post.username !== user.username &&
                    <img src={likeIcon} onClick={() => handlePostLikeToggle()} alt={"post like icon"} />
                }

                <img src={commentIcon} onClick={() => setShowComments(!showComments)} alt={"comment icon"} />

                {
                    post.username === user.username &&
                    <img src={editIcon} onClick={() => dispatch(edit({ view: true, id: postId }))}
                        alt={"edit icon"} />
                }

                <img src={shareIcon} alt={"share icon"} />

                {
                    user.role === "admin" || post.username === user.username &&
                    <img src={deleteIcon} onClick={() => handleDeletePost()} alt={"delete post icon"} />
                }
            </div>

            {
                commentsQuery.isFetched && showComments &&
                <CommentSection postId={postId} comments={comments} />
            }
        </div>
    )
}

export default Post