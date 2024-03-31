import { SET_USER, UPDATE_USER_API_CALLS, CLEAR_SESSION } from "../Types";

export const setUser =
  (isLoggedIn, id, apiCalls, isAdmin, username) => (dispatch) => {
    dispatch({
      type: SET_USER,
      payload: { isLoggedIn, id, apiCalls, isAdmin, username },
    });
  };

export const updateUserApiCalls = (apiCalls) => (dispatch) => {
  dispatch({
    type: UPDATE_USER_API_CALLS,
    payload: apiCalls,
  });
};

export const clearSession = () => (dispatch) => {
  dispatch({
    type: CLEAR_SESSION,
  });
};
