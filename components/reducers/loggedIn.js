// Reducer for checking whether logged in or not


const loggedIn = (state = false, action) => {
  switch (action.type) {
    case 'TOGGLE':
      return !state;
    default:
      return state;
  }
};
export default loggedIn;
