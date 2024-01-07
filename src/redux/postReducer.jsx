import { createSlice } from '@reduxjs/toolkit'
import posts from "../components/Posts/PostPage";
import comment from "../components/Posts/Comment";

export const postSlice = createSlice({
    name: 'posts',
    initialState: [],
    reducers: {

        likePost: (state, action) => {
            const { _id, user } = action.payload;
            return state.map(post => {
                if (post['_id'] == _id) {
                    if (post.likes.includes(user['id'])) return post
                    const postLikes = [...post.likes, user['_id']]
                    return { ...post, likes: postLikes }
                }
                return post
            })
        },

        unlikePost: (state, action) => {
            const { _id, user } = action.payload
            return state.map(post => {
                if (post['_id'] == _id) {
                    const reducedLikes = post.likes.filter(likeId => likeId !== user['_id'])
                    return { ...post, likes: reducedLikes }
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

        loadComments:(state, action ) => {
            const comments = action.payload.comments;
            const postId = action.payload.postId;

            state.map(post => {
                if(post.id === postId) post["comments"] = comments;
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
            commentId = action.payload.commentId;
            userId = action.payload.userId;

        }

    }
})

export const {loadPosts,
    unlikePost,
    likePost,
    deletePost,
    addPost,
    loadComments,
    addComment,
    deleteComment,
    editPost
} = postSlice.actions

export default postSlice.reducer