import { combineReducers } from 'redux';
import simpleReducer from './simpleReducer';
import myPostsReducer from '../containers/myPosts/reducers/myPostsReducer'

export default combineReducers({
    simpleReducer,
    myPostsReducer
});
