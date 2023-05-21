import { combineReducers } from 'redux'

export const counter = (state = 0, action) => {
  switch (action.type) {
    case 'increment':
      return state + 1
    case 'decrement':
      return state - 1
    case 'incrementByValue':
      return state + action.value;
    default: {
      return state;
    }
  }
}

export const isLogged = (state = false, action) => {
  switch (action.type) {
    case 'isLogged':
      return true
    case 'isNotLogged':
      return false;
    default: {
      return state;
    }
  }
}

function chatReducer(state = [], { type, payload }) {
  switch (type) {
    case 'load':
      return payload.chatData
    case 'addMessage':
      return state.chat.map(contact => {
        if (contact['_id'] == payload.currentChat) {
          contact.messages.push(payload.messageData)
        }
        return contact
      })
    default:
      return state
  }
}

function userReducer(state = {}, { type, payload }) {
  switch (type) {
    case 'loadUser':
      return payload.user
    default:
      return state
  }
}

function postReducer(state = [], { type, payload }) {
  switch (type) {
    case 'likePost':
      return state.map(post => {
        if (post['_id'] == payload._id) {
          if (post.likes.includes(payload.user['id'])) return post
          const postLikes = [...post.likes, payload.user['_id']]
          return { ...post, likes: postLikes }
        }
        return post
      })
    case 'unlikePost':
      return state.map(post => {
        if (post['_id'] == payload._id) {
          const reducedLikes = post.likes.filter(likeId => likeId !== payload.user['_id'])
          return { ...post, likes: reducedLikes }
        }
        return post
      })
    case 'deletePost':
      return state.filter(post => post['_id'] !== payload._id)
    case 'addPost':
      const newState = [payload.data, ...state]
      return newState
    case 'editPost':
      return state.map(post => post['_id'] == payload._id ? payload.data : post)
    case 'loadPosts':
      return payload.posts
    case 'addComment':
      const id = payload.data['_id']
      return state.map(post => {
        if (post['_id'] == id) post = payload.data;
        return post
      })
    case 'deleteComment':
      return state.map(post => {
        if (post['_id'] == payload.postID) {
          const indexOfComment = post.comments.findIndex(comment => comment['_id'] == payload.commentID)
          if (indexOfComment !== -1) post.comments.splice(indexOfComment, 1)
        }
        return post
      })
    default: return state
  }
}

function formViewReducer(state = {
  login: false,
  signup: false,
  post: false,
  edit: { view: false, _id: null },
  overlay: false
}, { type, payload }) {
  switch (type) {
    case "login":
      return ({ login: true, signup: false })
    case "signup":
      return ({ signup: true, login: false })
    case "post":
      return ({ ...state, post: true })
    case "edit":
      return ({ edit: { view: true,_id: payload._id }})
    case "overlay":
      return ({ signup: false, login: false, post: false, edit: false })
    default:
      return state
  }
}

export const allReducers = combineReducers({
  counter,
  isLogged,
  chatReducer,
  userReducer,
  postReducer,
  formViewReducer
})