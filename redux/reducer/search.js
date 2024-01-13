import * as actionTypes from '../actionTypes/SearchActionTypes';

const initialState = {
    deliverySearchData: null,
    diningSearchData: null,
    searchType: 'delivery'
}

const search = (state = initialState, action) =>{
    const {type, payload} = action;
    switch(type){
        case actionTypes.SET_DELIVERY_SEARCH:
            return{
                ...state,
                deliverySearchData: payload
            }
        case actionTypes.SET_DINING_SEARCH:
            return{
                ...state,
                diningSearchData: payload
            }
        case actionTypes.SET_SEARCH_TYPE:
            return{
                ...state,
                searchType: payload
            }
        default:
            return state
    }
}

export default search