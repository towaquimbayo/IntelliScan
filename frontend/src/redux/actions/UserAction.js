import { SET_USER, CLEAR_SESSION } from "../Types";

export const setUser =
  (isLoggedIn, id, apiCalls, isAdmin, username) => (dispatch) => {
    dispatch({
      type: SET_USER,
      payload: { isLoggedIn, id, apiCalls, isAdmin, username },
    });
  };

export const clearSession = () => (dispatch) => {
  dispatch({
    type: CLEAR_SESSION,
  });
};
