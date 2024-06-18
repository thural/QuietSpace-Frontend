import UserService from "/src/hooks/UserService";

const RenderOnAuthenticated = ({ children }) => (UserService.isLoggedIn()) ? children : null;

export default RenderOnAuthenticated
