import { createSlice } from '@reduxjs/toolkit'

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

        addComment: (state, action) => {
            const comment = action.payload;
            const postId = comment.postId;

            state.map(post => {
              if (post['id'] === postId) post.comments.unshift(comment);
              return post;
            });
        },

        deleteComment: (state, action) => {
            const {postID, commentID} = action.payload;
            state = state.map(post => {
                if (post['_id'] === postID) {
                  const indexOfComment = post.comments.findIndex(comment => comment['_id'] == commentID)
                  if (indexOfComment !== -1) post.comments.splice(indexOfComment, 1)
                }
                return post
              })
        }

    }
})

export const {loadPosts, unlikePost, likePost, deletePost, addPost, addComment, deleteComment, editPost} = postSlice.actions

export default postSlice.reducer