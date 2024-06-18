import NotAllowed from "./NotAllowed";
import UserService from "/src/hooks/UserService";

const RenderOnRole = ({ roles, showNotAllowed, children }) => (
  UserService.hasRealmRole(roles)) ? children : showNotAllowed ? <NotAllowed/> : null;

export default RenderOnRole
