import { GET_AUTH, SET_AUTH } from "../actions/types";

const initialState = {
  isLoggedin: !!localStorage.getItem("access_token")
};

export default function(state = initialState, action) {
  switch (action.type) {
    case GET_AUTH:
      return {
        ...state,
        isLoggedin: action.payload
      };

    case SET_AUTH:
      return {
        ...state,
        isLoggedin: action.payload
      };

    default:
      return state;
  }
}
