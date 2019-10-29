import * as React from 'react';
import {SyntheticEvent} from 'react';
import {Book} from '../../containers/app/types/googleBooksTypes';

export interface SearchBooksProps {
    books: Book[];
    isLoading: boolean;
    onClick: (event: SyntheticEvent) => void;
    onKeyDown: (e: React.KeyboardEvent) => void;
    onChange: (e: React.FormEvent<HTMLInputElement>) => void;
}
const SearchBooks: React.FunctionComponent<SearchBooksProps> = (props) => {
    return (
        <React.Fragment>
            <input
                disabled={props.isLoading}
                onChange={props.onChange}
                onKeyDown={props.onKeyDown}
                placeholder="Enter book name"
            />
            <button disabled={props.isLoading} onClick={props.onClick}>Search</button>
            <table>
                <thead>
                <tr>
                    <td style={{width: '10%'}}>Thumbnail</td>
                    <td style={{width: '20%'}}>Title</td>
                    <td style={{width: '10%'}}>Authors</td>
                    <td style={{width: '5%'}}>Language</td>
                    <td style={{width: '5%'}}>Published Date</td>
                    <td style={{width: '10%'}}>Publisher</td>
                    <td style={{width: '5%'}}>Page count</td>
                    <td style={{width: '5%'}}>Average Rating</td>
                    <td style={{width: '30%'}}>Description</td>
                </tr>
                </thead>
                {props.books.length ? (
                    <tbody>
                    {props.books.map((b: Book) => (
                        <tr key={b.id}>
                            <td>
                                <img src={b.volumeInfo.imageLinks.thumbnail} alt={b.volumeInfo.title} />
                            </td>
                            <td>{b.volumeInfo.title}</td>
                            <td>{b.volumeInfo.authors}</td>
                            <td>{b.volumeInfo.language}</td>
                            <td>{b.volumeInfo.publishedDate}</td>
                            <td>{b.volumeInfo.publisher}</td>
                            <td>{b.volumeInfo.pageCount}</td>
                            <td>{b.volumeInfo.averageRating}</td>
                            <td>{b.volumeInfo.description}</td>
                        </tr>
                    ))}
                    </tbody>
                ) : (
                    <tbody>
                    <tr>
                        <td className="no-results">
                            <h3>No results</h3>
                        </td>
                    </tr>
                    </tbody>
                )}
            </table>
        </React.Fragment>
    );
};

export default SearchBooks;
