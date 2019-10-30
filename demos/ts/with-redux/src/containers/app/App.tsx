import * as React from 'react';
import logo from '../../logo.svg';
import './App.styles.css';
import {Book, StoreState} from './types/googleBooksTypes';
import * as actions from './actions/googleBooks';
import {SetLoading} from './actions/googleBooks';
import {connect} from 'react-redux';
import {AnyAction} from 'redux';
import {ThunkDispatch} from 'redux-thunk';
import SearchBooks from '../../components/searchBooks/SearchBooks';

export interface Props {
    books: Book[];
    isLoading: boolean;
    search: (searchQuery: string) => Promise<void>;
    setLoading: (isLoading: boolean) => SetLoading;
}

export interface State {
    searchQuery: string;
}

class App extends React.Component<Props, State> {
    onChange = (e: React.FormEvent<HTMLInputElement>): void => {
        this.setState({searchQuery: e.currentTarget.value});
    };

    onClick = (): void => {
        this.props.search(this.state.searchQuery);
    };

    onKeyDown = (e: React.KeyboardEvent): void => {
        if (e.key === 'Enter') {
            this.props.search(this.state.searchQuery);
        }
    };

    render(): React.ReactNode {
        const { books, isLoading } = this.props;
        return (
            <div className="App">
                <header className="App-header">
                    <img src={logo} className="App-logo" alt="logo" />
                    <h3>Search books</h3>
                </header>
                <div className="content">
                    <SearchBooks
                        books={books}
                        onClick={this.onClick}
                        isLoading={isLoading}
                        onKeyDown={this.onKeyDown}
                        onChange={this.onChange}/>
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state: StoreState) => ({
    isLoading: state.books.isLoading,
    books: state.books.books,
});

const mapDispatchToProps = (dispatch: ThunkDispatch<any, any, AnyAction>) => {
    return {
        setLoading: (isLoading: boolean) => dispatch(actions.setLoading(isLoading)),
        search: (searchQuery: string) => dispatch(actions.search(searchQuery)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
