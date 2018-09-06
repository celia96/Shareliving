// Reducer for group

const group = (state = {}, action) => {
  switch (action.type) {
    case 'VIEW_GROUP':
      return state;
    case 'UPDATE_GROUP':
      return action.payload;
    case 'ADD_MEMBER':
      console.log("adding a member");
      return Object.assign({}, state, {members: [...state.members, action.payload]})
    case 'ADD_BILL':
      console.log("adding a bill");
      return Object.assign({}, state, {bills: [...state.bills, action.payload]})
    case 'ADD_CHORE':
      console.log("adding a chore");
      return Object.assign({}, state, {chores: [...state.chores, action.payload]})
    default:
      return state;
  }
};
export default group;
