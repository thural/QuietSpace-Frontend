import UserService from "/src/hooks/UserService";

const RenderOnAnonymous = ({ children }) => (!UserService.isLoggedIn()) ? children : null;

export default RenderOnAnonymous
