export const initialState = {};

function reducer(state, action) {
  switch (action.type) {
    case "USER_SIGNIN":
      return {
        ...state,
        user: action.payload,
      };
    case "UPDATE_PROFILE":
      return {
        ...state,
        user: {
          ...state.user,
          name: action.payload.name,
          image: action.payload.image,
        },
      };
    case "USER_SIGNOUT":
      return {
        ...state,
        user: undefined,
      };

    default:
      return state;
  }
}

export default reducer;
