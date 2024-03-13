import config from '../config';

console.log("Backend url: ", config.REACT_APP_BACKEND_URL)

export const constants = {
  appName: "MediLink",
  tokenKey: "token",
  userTypeKey: "userType",
  hostUrl: config.REACT_APP_BACKEND_URL
};