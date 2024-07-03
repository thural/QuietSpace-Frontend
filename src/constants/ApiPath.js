const BACKEND_HOST = import.meta.env.VITE_BACKEND_HOST
const BACKEND_PORT = import.meta.env.VITE_BACKEND_PORT

// const BACKEND_URL = `http://${BACKEND_HOST}:${BACKEND_PORT}`;
const BACKEND_URL = `http://localhost:8080`;
const BASE_URL = BACKEND_URL + "/api/v1";
const AUTH_URL = BACKEND_URL + "/auth";

export const USER_PATH = BASE_URL + "/users";
export const USER_PROFILE_URL = USER_PATH + "/profile";
export const POST_URL = BASE_URL + "/posts";
export const SIGNUP_URL = AUTH_URL + "/register";
export const LOGIN_URL = AUTH_URL + "/authenticate";
export const LOGOUT_URL = AUTH_URL + "/signout";
export const COMMENT_PATH = BASE_URL + "/comments";
export const COMMENT_LIKE = BASE_URL + "/comment-like";
export const COMMENT_LIKE_TOGGLE = COMMENT_LIKE + "/toggle-like";
export const POST_LIKE = BASE_URL + "/post-like";
export const POST_LIKE_TOGGLE = POST_LIKE + "/toggle-like";
export const CHAT_PATH = BASE_URL + "/chats";
export const CHAT_PATH_BY_OWNER = CHAT_PATH + "/owner";
export const CHAT_PATH_BY_MEMBER = CHAT_PATH + "/members";
export const MESSAGE_PATH = BASE_URL + "/messages";
export const FOLLOW_PATH = BASE_URL + "/follows";