import * as constants from '../constants';
import {ThunkAction, ThunkDispatch} from 'redux-thunk';
import {AnyAction} from 'redux';
import {Book, GoogleBooksResponse} from '../types/googleBooksTypes';

const GOOGLE_BOOKS_URL = 'https://www.googleapis.com/books/v1/volumes?q=title:';
function get<T>(url: string): Promise<T> {
    return fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error(response.statusText);
            }
            return response.json();
        });
}

export interface SetLoading {
    type: constants.SET_LOADING;
    isLoading: boolean;
}
export interface Search {
    type: constants.SEARCH;
    name: string;
}

export interface SetBooks {
    type: constants.SET_BOOKS;
    books: Book[];
}

export function setLoading(isLoading: boolean): SetLoading {
    return ({
        type: constants.SET_LOADING,
        isLoading: isLoading
    });
}

export const search = (searchQuery: string): ThunkAction<Promise<void>, {}, {}, AnyAction> => {
    return async (dispatch: ThunkDispatch<{}, {}, AnyAction>): Promise<void> => {
        dispatch(setLoading(true));
        return new Promise<void>(() => {
            return get<GoogleBooksResponse>(`${GOOGLE_BOOKS_URL}${encodeURIComponent(searchQuery)}`)
                .then((response: GoogleBooksResponse) => {
                    dispatch(setLoading(false));
                    return dispatch(setBooks(response.items));
                })
                .catch(error => {
                    dispatch(setLoading(false));
                    return dispatch(setBooks([]));
                });
        });
    }
};

export function setBooks(books: Book[]): SetBooks {
    return ({
        type: constants.SET_BOOKS,
        books: books
    });
}

export type GoogleBooksActions = SetLoading | SetBooks | Search;
