import {sep} from 'path';

export default {
    dependencies: {
        js: [
            {name: 'redux'},
            {name: 'react-redux'},
            {name: 'redux-thunk'}
        ],
        ts: [
            {name: 'redux'},
            {name: 'react-redux'},
            {name: 'redux-thunk'},
            {name: '@types/redux'},
            {name: '@types/react-redux'},
            {name: '@types/redux-thunk'}
        ],
    },
    [['src', 'actions', 'simpleAction'].join(sep)]: {
        js: {
            extension: 'js',
            contents: `export const simpleAction = () => dispatch => {
    dispatch({
        type: 'SIMPLE_ACTION',
        payload: 'result_of_simple_action'
    });
}`,
        }
    },
    [['src', 'reducers', 'simpleReducer'].join(sep)]: {
        js: {
            extension: 'js',
            contents: `export default (state = {}, action) => {
    switch (action.type) {
        case 'SIMPLE_ACTION':
            return {
                result: action.payload
            }
        default:
            return state
    }
}`,
        }
    },
    [['src', 'reducers', 'rootReducer'].join(sep)]: {
        js: {
            extension: 'js',
            contents: `import { combineReducers } from 'redux';
import simpleReducer from './simpleReducer';
export default combineReducers({
    simpleReducer
});`,
        },
        ts: {
            extension: 'tsx',
            contents: `import { combineReducers } from 'redux';
import googleBooksReducer from '../containers/app/reducers/googleBooksReducer';

export default combineReducers({
    books: googleBooksReducer
});
`
        }
    },
    [['src', 'store'].join(sep)]: {
        js: {
            extension: 'js',
            contents: `import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import rootReducer from './reducers/rootReducer';
    
export default function configureStore(initialState={}) {
    return createStore(
        rootReducer,
        initialState,
        applyMiddleware(thunk)
    );
}`,
        },
        ts: {
            extension: 'tsx',
            contents: `import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import rootReducer from './reducers/rootReducer';
import {StoreState} from './containers/app/types/googleBooksTypes';
import {initialBooksState} from './containers/app/reducers/googleBooksReducer';

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
`
        }
    },
    [['src', 'index'].join(sep)]: {
        js: {
            extension: 'js',
            contents: `import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux'
import configureStore from './store';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';

ReactDOM.render(
    <Provider store={configureStore()}>
        <App />
    </Provider>,
    document.getElementById('root')
);
serviceWorker.unregister();`
        },
        ts: {
            extension: 'tsx',
            contents: `import * as React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './containers/app/App';
import * as serviceWorker from './serviceWorker';
import { Provider } from 'react-redux'
import configureStore from './store';

ReactDOM.render(

    <Provider store={configureStore()}>
        <App />
    </Provider>, document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
`
        }
    },
    [['src', 'App'].join(sep)]: {
        js: {
            extension: 'js',
            contents: `import React, { Component } from 'react';
import { connect } from 'react-redux';
import { simpleAction } from './actions/simpleAction';
import logo from './logo.svg';
import './App.css';

class App extends Component {
  simpleAction = (event) => {
    this.props.simpleAction();
  };

  render() {
    return (
        <div className="App">
          <header className="App-header">
            <img src={logo} className="App-logo" alt="logo" />
            <h1 className="App-title">Welcome to React</h1>
          </header>
          <p className="App-intro">
            To get started, edit <code>src/App.js</code> and save to reload
          </p>
          <button onClick={this.simpleAction}>Test redux action</button>
          <pre>
             {JSON.stringify(this.props)}
          </pre>
        </div>
    );
  }
}

const mapDispatchToProps = dispatch => ({
  simpleAction: () => dispatch(simpleAction())
});

const mapStateToProps = state => ({
  ...state
});

export default connect(mapStateToProps, mapDispatchToProps)(App);`
        }
    },
    [['src', 'App.test'].join(sep)]: {
        js: {
            extension: 'js',
            contents: `import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux'
import configureStore from './store';
import App from './App';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<Provider store={configureStore(({}))}>
    <App />
  </Provider>, div);
  ReactDOM.unmountComponentAtNode(div);
});`
        }
    },
    'tsconfig': {
        ts: {
            extension: 'json',
            contents: `{
  "compilerOptions": {
    "target": "es5",
    "lib": [
      "dom",
      "dom.iterable",
      "esnext"
    ],
    "allowJs": true,
    "skipLibCheck": true,
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true,
    "strict": true,
    "forceConsistentCasingInFileNames": true,
    "module": "esnext",
    "moduleResolution": "node",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react"
  },
  "include": [
    "src"
  ]
}
`
        }
    },
    [['src', 'containers', 'app', 'App'].join(sep)]: {
        ts: {
            extension: 'css',
            contents: `.App {
  text-align: center;
  font-family: Roboto, sans-serif;
}

.App-logo {
  height: 40vmin;
}

.App-header {
  background-color: #282c34;
  min-height: 20%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-size: calc(10px + 2vmin);
  color: white;
}

.App-link {
  color: #09d3ac;
}

.content {
  padding: 16px;
}

table {
  border-collapse: collapse;
  width: 100%;
}

input {
  margin-bottom: 24px;
}

table th,td {
  border: 1px solid grey;
  padding: 8px;
}

td:last-child {
  white-space: nowrap;
  text-overflow:ellipsis;
  overflow: hidden;
  max-width:1px;
}

.no-results {
  border: 0;
}

.no-results h3 {
  position: absolute;
  width: 100%;
  text-align: center;
}
`
        }
    },
    [['src', 'containers', 'app', 'App.test'].join(sep)]: {
        ts: {
            extension: 'tsx',
            contents: `import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import configureStore from '../../store';
import {Provider} from 'react-redux';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(
      <Provider store={configureStore()}>
        <App />
      </Provider>, div);
  ReactDOM.unmountComponentAtNode(div);
});
`
        }
    },
    [['src', 'containers', 'app', 'App'].join(sep)]: {
        ts: {
            extension: 'tsx',
            contents: `import * as React from 'react';
import logo from '../../logo.svg';
import './App.css';
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
`
        }
    },
    [['src', 'containers', 'app', 'constants'].join(sep)]: {
        ts: {
            extension: 'tsx',
            contents: `export const SET_LOADING = 'SET_LOADING';
export type SET_LOADING = typeof SET_LOADING;

export const SEARCH = 'SEARCH';
export type SEARCH = typeof SEARCH;

export const SET_BOOKS = 'SET_BOOKS';
export type SET_BOOKS = typeof SET_BOOKS;
`
        }
    },
    [['src', 'containers', 'app', 'types', 'googleBooksTypes'].join(sep)]: {
        ts: {
            extension: 'tsx',
            contents: `export interface BooksState {
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

export interface GoogleBooksResponse {
    kind: string;
    totalItems: number;
    items: Book[];
}
`
        }
    },
    [['src', 'containers', 'app', 'constants'].join(sep)]: {
        ts: {
            extension: 'tsx',
            contents: `export const SET_LOADING = 'SET_LOADING';
export type SET_LOADING = typeof SET_LOADING;

export const SEARCH = 'SEARCH';
export type SEARCH = typeof SEARCH;

export const SET_BOOKS = 'SET_BOOKS';
export type SET_BOOKS = typeof SET_BOOKS;
`
        }
    },
    [['src', 'containers', 'app', 'reducers', 'googleBooks'].join(sep)]: {
        ts: {
            extension: 'tsx',
            contents: `import {Book, BooksState} from '../types/googleBooksTypes';
import {GoogleBooksActions} from '../actions/googleBooks';
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

            return {...state };
    }
    return state;
}
`
        }
    },
    [['src', 'containers', 'app', 'actions', 'googleBooks'].join(sep)]: {
        ts: {
            extension: 'tsx',
            contents: 'import * as constants from \'../constants\';\n' +
                'import {ThunkAction, ThunkDispatch} from \'redux-thunk\';\n' +
                'import {AnyAction} from \'redux\';\n' +
                'import {Book, GoogleBooksResponse} from \'../types/googleBooksTypes\';\n' +
                '\n' +
                'const GOOGLE_BOOKS_URL = \'https://www.googleapis.com/books/v1/volumes?q=title:\';\n' +
                'function get<T>(url: string): Promise<T> {\n' +
                '    return fetch(url)\n' +
                '        .then(response => {\n' +
                '            if (!response.ok) {\n' +
                '                throw new Error(response.statusText);\n' +
                '            }\n' +
                '            return response.json();\n' +
                '        });\n' +
                '}\n' +
                '\n' +
                'export interface SetLoading {\n' +
                '    type: constants.SET_LOADING;\n' +
                '    isLoading: boolean;\n' +
                '}\n' +
                'export interface Search {\n' +
                '    type: constants.SEARCH;\n' +
                '    name: string;\n' +
                '}\n' +
                '\n' +
                'export interface SetBooks {\n' +
                '    type: constants.SET_BOOKS;\n' +
                '    books: Book[];\n' +
                '}\n' +
                '\n' +
                'export function setLoading(isLoading: boolean): SetLoading {\n' +
                '    return ({\n' +
                '        type: constants.SET_LOADING,\n' +
                '        isLoading: isLoading\n' +
                '    });\n' +
                '}\n' +
                '\n' +
                'export const search = (searchQuery: string): ThunkAction<Promise<void>, {}, {}, AnyAction> => {\n' +
                '    return async (dispatch: ThunkDispatch<{}, {}, AnyAction>): Promise<void> => {\n' +
                '        return new Promise<void>(() => {\n' +
                '\n' +
                '            return get<GoogleBooksResponse>(`${GOOGLE_BOOKS_URL}${encodeURIComponent(searchQuery)}`)\n' +
                '                .then((response: GoogleBooksResponse) => {\n' +
                '                    dispatch(setLoading(false));\n' +
                '                    return dispatch(setBooks(response.items));\n' +
                '                })\n' +
                '                .catch(error => {\n' +
                '                    dispatch(setLoading(false));\n' +
                '                    return dispatch(setBooks([]));\n' +
                '                });\n' +
                '        });\n' +
                '    }\n' +
                '};\n' +
                '\n' +
                'export function setBooks(books: Book[]): SetBooks {\n' +
                '    return ({\n' +
                '        type: constants.SET_BOOKS,\n' +
                '        books: books\n' +
                '    });\n' +
                '}\n' +
                '\n' +
                'export type GoogleBooksActions = SetLoading | SetBooks | Search;'
        }
    },
    [['src', 'components', 'searchBooks', 'SearchBooks'].join(sep)]: {
        ts: {
            extension: 'tsx',
            contents: 'import * as React from \'react\';\n' +
                'import {SyntheticEvent} from \'react\';\n' +
                'import {Book} from \'../../containers/app/types/googleBooksTypes\';\n' +
                '\n' +
                'export interface SearchBooksProps {\n' +
                '    books: Book[];\n' +
                '    isLoading: boolean;\n' +
                '    onClick: (event: SyntheticEvent) => void;\n' +
                '    onKeyDown: (e: React.KeyboardEvent) => void;\n' +
                '    onChange: (e: React.FormEvent<HTMLInputElement>) => void;\n' +
                '}\n' +
                'const SearchBooks: React.FunctionComponent<SearchBooksProps> = (props) => {\n' +
                '    return (\n' +
                '        <React.Fragment>\n' +
                '            <input\n' +
                '                disabled={props.isLoading}\n' +
                '                onChange={props.onChange}\n' +
                '                onKeyDown={props.onKeyDown}\n' +
                '                placeholder="Enter book name"\n' +
                '            />\n' +
                '            <button disabled={props.isLoading} onClick={props.onClick}>Search</button>\n' +
                '            <table>\n' +
                '                <thead>\n' +
                '                <tr>\n' +
                '                    <td style={{width: \'10%\'}}>Thumbnail</td>\n' +
                '                    <td style={{width: \'20%\'}}>Title</td>\n' +
                '                    <td style={{width: \'10%\'}}>Authors</td>\n' +
                '                    <td style={{width: \'5%\'}}>Language</td>\n' +
                '                    <td style={{width: \'5%\'}}>Published Date</td>\n' +
                '                    <td style={{width: \'10%\'}}>Publisher</td>\n' +
                '                    <td style={{width: \'5%\'}}>Page count</td>\n' +
                '                    <td style={{width: \'5%\'}}>Average Rating</td>\n' +
                '                    <td style={{width: \'30%\'}}>Description</td>\n' +
                '                </tr>\n' +
                '                </thead>\n' +
                '                {props.books.length ? (\n' +
                '                    <tbody>\n' +
                '                    {props.books.map((b: Book) => (\n' +
                '                        <tr key={b.id}>\n' +
                '                            <td>\n' +
                '                                <img' +
                '                                   src={b.volumeInfo.imageLinks.thumbnail}' +
                '                                   alt={b.volumeInfo.title}' +
        '                                        />\n' +
                '                            </td>\n' +
                '                            <td>{b.volumeInfo.title}</td>\n' +
                '                            <td>{b.volumeInfo.authors}</td>\n' +
                '                            <td>{b.volumeInfo.language}</td>\n' +
                '                            <td>{b.volumeInfo.publishedDate}</td>\n' +
                '                            <td>{b.volumeInfo.publisher}</td>\n' +
                '                            <td>{b.volumeInfo.pageCount}</td>\n' +
                '                            <td>{b.volumeInfo.averageRating}</td>\n' +
                '                            <td>{b.volumeInfo.description}</td>\n' +
                '                        </tr>\n' +
                '                    ))}\n' +
                '                    </tbody>\n' +
                '                ) : (\n' +
                '                    <tbody>\n' +
                '                    <tr>\n' +
                '                        <td className="no-results">\n' +
                '                            <h3>No results</h3>\n' +
                '                        </td>\n' +
                '                    </tr>\n' +
                '                    </tbody>\n' +
                '                )}\n' +
                '            </table>\n' +
                '        </React.Fragment>\n' +
                '    );\n' +
                '};\n' +
                '\n' +
                'export default SearchBooks;\n'
        }
    },
}
