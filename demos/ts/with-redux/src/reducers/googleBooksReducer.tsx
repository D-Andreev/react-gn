import {Book, BooksState, StoreState} from '../types';
import {GoogleBooksActions} from '../actions';
import {SET_BOOKS, SET_LOADING} from '../constants';

export const initialBooksState: BooksState = {isLoading: false, books: []};
export default function googleBooks(
    state: BooksState = initialBooksState,
    action: GoogleBooksActions): BooksState {
    switch (action.type) {
        case SET_LOADING:
            state.isLoading = action.isLoading;
            return { ...state };
        case SET_BOOKS:
            state.books = action.books || [];
            state.books = state.books
                .map((book: Book) => {
                    book.volumeInfo.imageLinks = book.volumeInfo.imageLinks ?
                        book.volumeInfo.imageLinks : {thumbnail: ''};
                    book.volumeInfo.averageRating = book.volumeInfo.averageRating ?
                        book.volumeInfo.averageRating : 0;
                    return book;
                })
                .sort((a: Book, b: Book) => {
                    if (b.volumeInfo.averageRating > a.volumeInfo.averageRating) {
                        return 1;
                    } else if (b.volumeInfo.averageRating === a.volumeInfo.averageRating) {
                        return 0;
                    }

                    return -1;
                });
            console.log('zi books', state.books);
            return {...state };
    }
    return state;
}
