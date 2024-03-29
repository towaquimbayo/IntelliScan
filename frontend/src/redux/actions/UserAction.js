import { SET_USER, CLEAR_SESSION } from "../Types";

export const setUser = (isLoggedIn, apiCalls) => (dispatch) => {
  dispatch({
    type: SET_USER,
    payload: { isLoggedIn, apiCalls },
  });
};

export const clearSession = () => (dispatch) => {
  dispatch({
    type: CLEAR_SESSION,
  });
};
