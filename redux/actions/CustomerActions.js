import * as actionTypes from '../actionTypes/CustomerActionTypes';

export const setCustomerData = payload => ({
  type: actionTypes.SET_CUSTOMER_DATA,
  payload,
});

export const setLocation = payload => ({
  type: actionTypes.SET_LOCATION,
  payload,
});

export const isLocationDefined = payload =>({
  type: actionTypes.IS_LOCATION_DEFINED,
  payload
})

export const setFirebaseId = payload => ({
  type: actionTypes.SET_FIREBASE_ID,
  payload,
});

export const setWallet = payload => ({
  type: actionTypes.SET_WALLET,
  payload,
});

export const setCallInvoiceId = payload =>({
  type: actionTypes.SET_CALL_INVOICE_ID,
  payload,
})

export const setNotifications = payload =>({
  type: actionTypes.SET_NOTIFICATIONS,
  payload,
})

export const setNotificationCounts = payload =>({
  type: actionTypes.SET_NOTIFICATION_COUNTS,
  payload,
})

export const setIsSelfPickup = payload =>({
  type: actionTypes.IS_SELF_PICKUP,
  payload,
})

export const setCleanStore = () => ({
  type: actionTypes.CLEAN_STORE,
});


