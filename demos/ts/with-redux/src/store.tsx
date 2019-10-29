import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import rootReducer from './reducers/rootReducer';
import {StoreState} from './types';
import {initialBooksState} from './reducers/googleBooksReducer';

export const initialStoreState: StoreState = {
    books: initialBooksState
};
export default function configureStore(initialState: any = initialStoreState) {
    return createStore(
        rootReducer,
        initialState,
        applyMiddleware(thunk)
    );
}
