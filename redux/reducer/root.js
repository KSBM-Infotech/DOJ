import {combineReducers} from 'redux';
import {CLEAN_STORE} from '../actionTypes/CustomerActionTypes';
import customer from './customer';
import cart from './cart'
import search from './search';


const rootReducer = combineReducers({
    customer,
    cart,
    search,
});

const appReducer = (state, action) => {
  if (action.type == CLEAN_STORE) {
    state = undefined;
  }
  return rootReducer(state, action);
};

export default appReducer;
