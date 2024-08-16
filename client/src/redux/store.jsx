import {
  createStore
} from 'redux';

const initialState = {
  user: {
    id: null,
    username: null,
    shells: 0,
    shovel: 0,
    treasures: {
      "Fossils": {
        "Sea Shell Fossil": 0,
        "Coral Fossil": 0,
        "Crinoid Fossil": 0,
        "Shark Tooth": 0,
        "Ammonite Fossil": 0,
        "Dinosaur Bone Fragment": 0,
        "Trilobite Fossil": 0
      },
      "Glass": {
        "White Sea Glass": 0,
        "Green Sea Glass": 0,
        "Brown Sea Glass": 0,
        "Blue Sea Glass": 0,
        "Amber Sea Glass": 0,
        "Red Sea Glass": 0,
        "Black Sea Glass": 0
      },
      "Marine": {
        "Seaweed": 0,
        "Sea Urchin Skeleton": 0,
        "Hermit Crab Shell": 0,
        "Sea Anemone": 0,
        "Sea Sponge": 0,
        "Starfish": 0,
        "Seahorse": 0
      },
      "Minerals": {
        "Pebble": 0,
        "Sandstone": 0,
        "Agate": 0,
        "Jasper": 0,
        "Ammonite": 0,
        "Geode": 0,
        "Moonstone": 0
      },
      "Treasures": {
        "Broken Glass": 0,
        "Rusty Nails": 0,
        "Old Coins": 0,
        "Glass Bottle": 0,
        "Pearl Necklace": 0,
        "Gold Doubloon": 0,
        "Jeweled Crown": 0
      }
    },
    miscellaneous: {
      treasures: 0,
      history: []
    }
  }
}


const reducer = (state = initialState, action) => {
  switch (action.type) {
    case 'SET_USER':
      return {
        ...state,
        user: {
          ...state.user,
          id: action.payload.id,
          username: action.payload.username,
          shells: action.payload.shells,
          shovel: action.payload.shovel,
          treasures: action.payload.treasures,
          miscellaneous: action.payload.miscellaneous
        }
      };

    case 'LOGOUT':
      return {
        ...state,
        user: {
          ...initialState.user
        }
      };

    default:
      return state;
  }
};

const store = createStore(reducer);

export default store;