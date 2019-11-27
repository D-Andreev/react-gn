import React, { Component } from 'react';
import { connect } from 'react-redux';
import { simpleAction } from './actions/simpleAction';
import MyPosts from './containers/myPosts/myPosts';
import logo from './logo.svg';
import './App.css';
import Label from "./components/label/Label";

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
            <Label>Posts</Label>
            <MyPosts />
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

export default connect(mapStateToProps, mapDispatchToProps)(App);
