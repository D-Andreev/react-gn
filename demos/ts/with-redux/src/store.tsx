import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import rootReducer from './reducers/rootReducer';
import {StoreState} from './containers/app/types/googleBooksTypes';
import {initialBooksState} from './containers/app/reducers/googleBooks';

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
