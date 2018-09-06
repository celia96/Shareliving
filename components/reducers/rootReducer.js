import { combineReducers } from 'redux';
import user from './user';
import group from './group';
import loggedIn from './loggedIn';
import bill from './bill';
import chore from './chore';

const rootReducer = combineReducers({
  user,
  group,
  loggedIn,
  bill,
  chore
});
export default rootReducer;
