const AllItems = [];

const states = {
  AllItems: AllItems,
};

const handleAddItems = (state = states, action) => {
  const product = action.payload;
  switch (action.type) {
    case "ADDALLITEMS":
      const updatedItems = [...product];
      return {
        ...state,
        AllItems: updatedItems,
      };
    default:
      return state;
      break;
  }
};

export default handleAddItems;
