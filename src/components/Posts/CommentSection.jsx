import React, {useEffect, useRef, useState} from "react";
import Comment from "./Comment";
import styles from "./styles/commentSectionStyles";
import {COMMENT_PATH} from "../../constants/ApiPath";
import {fetchCreateComment} from "../../api/commentRequests";
import InputEmoji from "react-input-emoji";
import { useMutation, useQueryClient } from "@tanstack/react-query";


const CommentSection = ({postId, comments}) => {

    const queryClient = useQueryClient();
    const user = queryClient.getQueryData("user");
    const auth = queryClient.getQueryData("autt");

    const [commentData, setCommentData] = useState({postId: postId, userId: user.id, text: ''});


    const cursorPosition = useRef(commentData.text.length);
    const inputRef = useRef(null);

    useEffect(() => {
        if (inputRef === null) return;
        if (inputRef.current === null) return;
        inputRef.current.setSelectionRange(cursorPosition.current, cursorPosition.current);
    }, [commentData.text]);


    const newCommentMutation = useMutation({
        mutationFn: async (commentData) => {
            const response = await fetchCreateComment(COMMENT_PATH, commentData, auth["token"]);
            return response.json();
        },
        onSuccess: (data, variables, context) => {
            queryClient.setQueryData(["comments", data.id], commentData); // manually cache data before refetch
            queryClient.invalidateQueries(["comments"], { exact: true });
            console.log(context);
        },
        onError: (error, variables, context) => {
            console.log("error on adding comment: ", error.message)
        },
        onSettled: (data, error, variables, context) => { // optional for both error and success cases
            if (error) {
                console.error("error adding new comment:", error);
                // Handle error (e.g., show an error message)
            } else {
                console.log("comment added successfully:", data);
                // Perform any cleanup or additional actions
            }
        },
        onMutate: () => { // do something before mutation
            return { message: "adding new comment" } // create context
        },
    })
    

    const handleCreateComment = async (commentData) => {
        newCommentMutation.mutate(commentData);
    }

    const handleEmojiInput = (event) => {
        setCommentData({...commentData, text: event})
    }

    const handleSubmit = () => {
        handleCreateComment(commentData);
    }

    const classes = styles();

    return (
        <div className={classes.commentSection}>
            <form>
                <InputEmoji
                    className={classes.commentInput}
                    value={commentData.text}
                    onChange={handleEmojiInput}
                    fontSize={15}
                    cleanOnEnter
                    buttonElement
                    borderColor="#FFFFFF"
                    onEnter={handleSubmit}
                    theme="light"
                    placeholder="Type a comment"
                />
            </form>

            {
                comments && comments.map(comment =>
                    <Comment
                        key={comment["id"]}
                        loggedUser={user}
                        comment={comment}
                        postId={postId}
                    />
                )
            }
        </div>
    )
}

export default CommentSection