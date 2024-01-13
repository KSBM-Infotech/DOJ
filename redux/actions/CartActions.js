import * as actionTypes from '../actionTypes/CartActionTypes';

export const setForCart = payload => ({
    type: actionTypes.SET_FOR_CART,
    payload,
  });

export const setCartData = payload =>({
  type: actionTypes.SET_CART_DATA,
  payload
})

export const setSelfDeliveryCartData = payload =>({
  type: actionTypes.SET_SELF_DELIVERY_CART_DATA,
  payload
})