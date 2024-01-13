import {createStore} from 'redux';
import appReducer from '../reducer/root'
export const store = createStore(appReducer);
