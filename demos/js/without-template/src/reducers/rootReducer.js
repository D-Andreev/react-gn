import { combineReducers } from 'redux';
import simpleReducer from './simpleReducer';
import countReducer from '../containers/counter/reducers/counterReducer';

export default combineReducers({
    simpleReducer,
    count: countReducer
});
