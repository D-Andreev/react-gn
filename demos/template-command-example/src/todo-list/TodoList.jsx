import React, { Component } from 'react';
import { connect } from 'react-redux';
import './TodoList.css';
import * as PropTypes from 'prop-types';

class TodoList extends Component {
  constructor(props) {
    super(props);
    this.state = { count: 0 };
  }
  render() {
    return <div>TodoList</div>;
  }
}

const mapDispatchToProps = dispatch => ({});

const mapStateToProps = state => ({});

TodoList.propTypes = {
  className: PropTypes.string
};

export default connect(mapStateToProps, mapDispatchToProps)(TodoList);
