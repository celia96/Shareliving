// Reducer for user


const user = (state = {}, action) => {
  switch (action.type) {
    case 'VIEW_USER':
      return state
    case 'GET_USER':
      console.log("getting a user");
      return action.payload;
    case 'ADD_GROUP':
      // console.log("adding a group");
      // console.log("result will be: ", Object.assign({}, state, {groups: [...state.groups, action.payload]}));
      return Object.assign({}, state, {groups: [...state.groups, action.payload]})
    case 'ADD_FRIEND':
      // console.log("adding a friend");
      // console.log("result will be: ", Object.assign({}, state, {groups: [...state.groups, action.payload]}));
      return Object.assign({}, state, {friends: [...state.groups, action.payload]})
    default:
      return state;
  }
};
export default user;
