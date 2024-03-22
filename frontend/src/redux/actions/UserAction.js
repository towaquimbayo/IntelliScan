import { SET_USER_LOGGED_IN, CLEAR_SESSION } from "../Types";

export const setUserLoggedIn = (isLoggedIn) => (dispatch) => {
  dispatch({
    type: SET_USER_LOGGED_IN,
    payload: isLoggedIn,
  });
};

export const clearSession = () => (dispatch) => {
  dispatch({
    type: CLEAR_SESSION,
  });
};
