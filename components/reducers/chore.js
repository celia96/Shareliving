// Reducer for chore

const chore = (state = {}, action) => {
  switch (action.type) {
    case 'UPDATE_CHORE':
      console.log("payload ", action.payload);
      return action.payload;
    default:
      return state;
  }
};
export default chore;
