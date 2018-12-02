import { GET_AUTH, SET_AUTH } from "./types";

export const getAuth = () => dispatch => {
  dispatch({ type: GET_AUTH, payload: !!localStorage.getItem("access_token") });
};

export const setAuth = data => dispatch => {
  dispatch({ type: SET_AUTH, payload: data });
};
