import { combineReducers } from 'redux';
import googleBooksReducer from '../containers/app/reducers/googleBooksReducer';

export default combineReducers({
    books: googleBooksReducer
});
