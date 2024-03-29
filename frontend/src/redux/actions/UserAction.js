import { SET_USER, CLEAR_SESSION } from "../Types";

export const setUser =
  (isLoggedIn, apiCalls, isAdmin, username) => (dispatch) => {
    dispatch({
      type: SET_USER,
      payload: { isLoggedIn, apiCalls, isAdmin, username },
    });
  };

export const clearSession = () => (dispatch) => {
  dispatch({
    type: CLEAR_SESSION,
  });
};
