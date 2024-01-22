import {createSlice} from '@reduxjs/toolkit'

export const postSlice = createSlice({
    name: 'posts',
    initialState: [],
    reducers: {

        toggleLikePost: (state, action) => {
            const {postId, userId} = action.payload;
            return state.map(post => {
                if (post['id'] === postId) {
                    if (post.likes.includes(userId)) {
                        const reducedLikes = post.likes
                            .filter(likeId => likeId !== userId)
                        return {...post, likes: reducedLikes}
                    } else {
                        const postLikes = [...post.likes, userId]
                        return {...post, likes: postLikes}
                    }
                }
                return post
            })
        },

        deletePost: (state, action) => {
            return state.filter(post => post['id'] !== action.payload.postId)
        },

        addPost: (state, action) => {
            return [action.payload, ...state]
        },

        editPost: (state, action) => {
            return state.map(post => post['id'] === action.payload.id ? action.payload : post)
        },

        loadPosts: (state, action) => {
            return action.payload;
        },

        loadComments: (state, action) => {
            const comments = action.payload.comments;
            const postId = action.payload.postId;

            state.map(post => {
                if (post.id === postId) post["comments"] = comments;
                return post;
            })
        },

        addComment: (state, action) => {
            const comment = action.payload;
            const postId = comment.postId;

            state.map(post => {
                if (post['id'] === postId) post.comments.unshift(comment);
                return post;
            });
        },

        deleteComment: (state, action) => {
            const {postId, commentId} = action.payload;
            state.map(post => {
                if (post.id === postId) {
                    const indexOfComment = post.comments.findIndex(comment => comment.id === commentId)
                    if (indexOfComment !== -1) post.comments.splice(indexOfComment, 1)
                }
                return post
            })
        },

        likeComment: (state, action) => {
            const commentId = action.payload.commentId;
            const userId = action.payload.userId;

        }

    }
})

export const {
    loadPosts,
    toggleLikePost,
    deletePost,
    addPost,
    loadComments,
    addComment,
    deleteComment,
    editPost
} = postSlice.actions

export default postSlice.reducer