import { SET_USER, CLEAR_SESSION } from "../Types";

export const initialState = {
  isLoggedIn: false,
  apiCalls: 0,
  isAdmin: false,
  username: "",
};

export default function UserReducer(state = initialState, action) {
  switch (action.type) {
    case SET_USER:
      return {
        ...state,
        isLoggedIn: action.payload.isLoggedIn,
        apiCalls: action.payload.apiCalls,
        isAdmin: action.payload.isAdmin,
        username: action.payload.username,
      };
    case CLEAR_SESSION:
      return initialState;
    default:
      return state;
  }
}
