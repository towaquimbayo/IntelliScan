import { SET_USER_LOGGED_IN, CLEAR_SESSION } from "../Types";

export const initialState = {
  isLoggedIn: false,
};

export default function UserReducer(state = initialState, action) {
  switch (action.type) {
    case SET_USER_LOGGED_IN:
      return { ...state, isLoggedIn: action.payload };
    case CLEAR_SESSION:
      return { ...state, isLoggedIn: false };
    default:
      return state;
  }
}
