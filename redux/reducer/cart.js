import * as actionTypes from '../actionTypes/CartActionTypes';

const initialState = {
  forCartData: [],
  cartData: null,
  selfDeliveryCartData: null,
};

const cart = (state = initialState, action) => {
  const {type, payload} = action;
  switch (type) {
    case actionTypes.SET_FOR_CART:
      return {
        ...state,
        forCartData: payload,
      };
    case actionTypes.SET_CART_DATA:
      return {
        ...state,
        cartData: payload,
      };
    case actionTypes.SET_SELF_DELIVERY_CART_DATA:
      return {
        ...state,
        selfDeliveryCartData: payload,
      };
    default:
      return state;
  }
};

export default cart;
