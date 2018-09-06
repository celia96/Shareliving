// Reducer for bill

const bill = (state = {}, action) => {
  switch (action.type) {
    case 'UPDATE_BILL':
      console.log("payload ", action.payload);
      return action.payload;
    default:
      return state;
  }
};
export default bill;
