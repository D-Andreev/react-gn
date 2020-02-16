export interface BooksState {
    isLoading: boolean;
    books: Book[];
}

export interface StoreState {
    books: BooksState;
}

export interface Book {
    id: string;
    volumeInfo: {
        title: string;
        publisher: string;
        pageCount: number;
        imageLinks: {thumbnail: string};
        publishedDate: string;
        language: string;
        description: string;
        authors: string[];
        averageRating: number;
    };
}

export interface BooksResponse {
    items: Book[];
    kind: string;
    totalItems: number;
}

export interface GoogleBooksResponse {
    kind: string;
    totalItems: number;
    items: Book[];
}
