import { NEW_DATA, SET_DATA } from "./types";

export const fetchNewData = data => dispatch => {
  dispatch({
    type: NEW_DATA,
    payload: data
  });
};

export const set = data => dispatch => {
  dispatch({
    type: SET_DATA,
    payload: data
  });
};
