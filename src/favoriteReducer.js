const initialFavorites = JSON.parse(
  localStorage.getItem("favorites")
) || [];

function favoriteReducer(state, action) {
  switch (action.type) {
    case "TOGGLE_FAVORITE": {
      const exists = state.some(
        (photo) => photo.id === action.payload.id
      );

      if (exists) {
        return state.filter(
          (photo) => photo.id !== action.payload.id
        );
      }

      return [...state, action.payload];
    }

    case "LOAD_FAVORITES":
      return action.payload;

    default:
      return state;
  }
}

export { initialFavorites };
export default favoriteReducer;
