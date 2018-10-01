import { combineReducers } from "redux";
import podcast from "./podcast";
import user from "./user";

const reducer = combineReducers({
  podcast,
  user
});

export default reducer;
