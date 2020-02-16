import * as constants from '../constants';
import {ThunkAction, ThunkDispatch} from 'redux-thunk';
import {AnyAction} from 'redux';
import {Book, BooksResponse, GoogleBooksResponse} from '../types/googleBooksTypes';

const GOOGLE_BOOKS_URL = 'https://www.googleapis.com/books/v1/volumes?q=title:';
async function get<T>(url: string): Promise<BooksResponse> {
    const response: Response = await fetch(url);
    return await response.json();
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
    return async (dispatch: ThunkDispatch<{}, {}, AnyAction>): Promise<any> => {
        dispatch(setLoading(true));
        let books: Book[] = [];
        try {
            const url = `${GOOGLE_BOOKS_URL}${encodeURIComponent(searchQuery)}`;
            const response: BooksResponse = await get<GoogleBooksResponse>(url);
            books = response.items;
        } catch (e) {}
        dispatch(setLoading(false));
        return dispatch(setBooks(books));
    }
};

export function setBooks(books: Book[]): SetBooks {
    return ({
        type: constants.SET_BOOKS,
        books: books
    });
}

export type GoogleBooksActions = SetLoading | SetBooks | Search;
