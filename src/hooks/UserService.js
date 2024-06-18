import Keycloak from "keycloak-js";

const _kc =  new Keycloak({
  url: import.meta.env.VITE_KEYCLOAK_URL,
  realm: import.meta.env.VITE_KEYCLOAK_REALM,
  clientId: import.meta.env.VITE_KEYCLOAK_CLIENT,
})

/**
 * Initializes Keycloak instance and calls the provided callback function if successfully authenticated.
 *
 * @param onAuthenticatedCallback
 */
const initKeycloak = (onAuthenticatedCallback) => {
  _kc.init({
    onLoad: 'check-sso',
    // silentCheckSsoRedirectUri: window.location.origin,
    pkceMethod: 'S256',
  })
    .then((authenticated) => {
      if (!authenticated) {
        console.log("user is not authenticated..!");
        UserService.doLogin();
      } else onAuthenticatedCallback();
    })
    .catch(console.error);
};

const doLogin = _kc.login;

const doLogout = _kc.logout;

const getToken = () => _kc.token;

const getTokenParsed = () => _kc.tokenParsed;

const isLoggedIn = () => !!_kc.token;

const updateToken = (successCallback) =>
  _kc.updateToken(5)
    .then(successCallback)
    .catch(doLogin);

const getUsername = () => _kc.tokenParsed?.preferred_username;

const getFirstName = () => _kc.tokenParsed?.given_name;

const hasRealmRole = (roles) => roles.some((role) => _kc.hasRealmRole(role));

const hasRole = (roles) => roles.some((role) => _kc.hasRole(role));

const UserService = {
  initKeycloak,
  doLogin,
  doLogout,
  isLoggedIn,
  getToken,
  getTokenParsed,
  updateToken,
  getUsername,
  getFirstName,
  hasRealmRole,
  hasRole,
};

export default UserService;
