import { combineReducers } from 'redux';
import user from './user';
import loggedIn from './loggedIn';
import group from './group';



const rootReducer = combineReducers({
  user,
  loggedIn,
  group
});
export default rootReducer;
