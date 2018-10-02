import { combineReducers } from "redux";
import podcast from "./podcast";
import user from "./user";
import channels from './channel'

const reducer = combineReducers({
  podcast,
  user,
  channels
});

export default reducer;
