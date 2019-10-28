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
            {name: 'redux-thunk'}
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
    }
}
