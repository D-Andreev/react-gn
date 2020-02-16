import { combineReducers } from 'redux';
import googleBooksReducer from '../containers/app/reducers/googleBooks';

export default combineReducers({
    books: googleBooksReducer
});
