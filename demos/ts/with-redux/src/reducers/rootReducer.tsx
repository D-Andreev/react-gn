import { combineReducers } from 'redux';
import googleBooksReducer from './googleBooksReducer';

export default combineReducers({
    books: googleBooksReducer
});
