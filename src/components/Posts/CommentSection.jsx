import React, { useEffect, useRef, useState } from "react";
import Comment from "./Comment";
import styles from "./styles/commentSectionStyles";
import { COMMENT_PATH } from "../../constants/ApiPath";
import { fetchCreateComment } from "../../api/commentRequests";
import InputEmoji from "react-input-emoji";
import { useMutation, useQueryClient } from "@tanstack/react-query";


const CommentSection = ({ postId }) => {

    const queryClient = useQueryClient();
    const user = queryClient.getQueryData(["user"]);
    const auth = queryClient.getQueryData("auth");
    const commentData = queryClient.getQueryData(["comments", { id: postId }]);
    const comments = commentData.content;

    const [commentInput, setCommentData] = useState({ postId: postId, userId: user?.id, text: '' });

    const cursorPosition = useRef(commentInput.text.length);
    const inputRef = useRef(null);

    useEffect(() => {
        if (inputRef === null) return;
        if (inputRef.current === null) return;
        inputRef.current.setSelectionRange(cursorPosition.current, cursorPosition.current);
    }, [commentInput.text]);


    const newCommentMutation = useMutation({
        mutationFn: async (commentData) => {
            const response = await fetchCreateComment(COMMENT_PATH, commentData, auth["token"]);
            return response.json();
        },
        onSuccess: (data, variables) => {
            queryClient.setQueryData(["comments", data.id], commentInput); // manually cache data before refetch
            queryClient.invalidateQueries(["comments"], { id: postId });
        },
        onError: (error, variables, context) => {
            console.log("error on adding comment: ", error.message)
        },
    })


    const handleCreateComment = async (commentData) => {
        newCommentMutation.mutate(commentData);
    }

    const handleEmojiInput = (event) => {
        setCommentData({ ...commentInput, text: event })
    }

    const handleSubmit = () => {
        handleCreateComment(commentInput);
    }

    const classes = styles();

    return (
        <div className={classes.commentSection}>
            <form>
                <InputEmoji
                    className={classes.commentInput}
                    value={commentInput.text}
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
                        comment={comment}
                    />
                )
            }
        </div>
    )
}

export default CommentSection