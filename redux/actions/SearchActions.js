import * as SearchActions from '../actionTypes/SearchActionTypes';

export const setDeliverySearch = payload=>({
    type: SearchActions.SET_DELIVERY_SEARCH,
    payload
})

export const setDiningSearch = payload =>({
    type: SearchActions.SET_DINING_SEARCH,
    payload
})

export const setSearchType = payload=>({
    type: SearchActions.SET_SEARCH_TYPE,
    payload
})