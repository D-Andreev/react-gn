import * as React from 'react';
import logo from './logo.svg';
import './App.css';
import {Book, StoreState} from './types';
import * as actions from './actions';
import {connect} from 'react-redux';
import {AnyAction} from 'redux';
import {ThunkDispatch} from 'redux-thunk';
import {SetLoading} from './actions';

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
  constructor(props: Props) {
    super(props);

    this.state = {
      searchQuery: ''
    }
  }
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
    const { books } = this.props;
    return (
        <div className="App">
          <header className="App-header">
            <img src={logo} className="App-logo" alt="logo" />
            <h3>Search books</h3>
          </header>
          <div className="content">
            <input
                disabled={this.props.isLoading}
                onChange={this.onChange}
                onKeyDown={this.onKeyDown}
                placeholder="Enter book name"
            />
            <button disabled={this.props.isLoading} onClick={this.onClick}>Search</button>
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
                {books.length ? (
                    <tbody>
                      {books.map((b: Book) => (
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
                          <td title={b.volumeInfo.description}>{b.volumeInfo.description}</td>
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
