import { SET_USER, CLEAR_SESSION } from "../Types";

export const initialState = {
  isLoggedIn: false,
  apiCalls: 0,
};

export default function UserReducer(state = initialState, action) {
  switch (action.type) {
    case SET_USER:
      return { 
        ...state,
        isLoggedIn: action.payload.isLoggedIn,
        apiCalls: action.payload.apiCalls, 
      };
    case CLEAR_SESSION:
      return initialState;
    default:
      return state;
  }
}
