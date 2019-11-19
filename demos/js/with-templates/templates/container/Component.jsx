import './Component.css';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { {action1} } from './actions/{action1}';
import './{Component}.css';

class {Component} extends Component {
    onClick = () => {
        this.props.{action1}();
    };

    render() {
        const { {state1}, {state2} } = this.props;
        return (
            <div className="{component}">
                <button onClick={this.onClick}> Get posts </button>
                {state2 ? (
                    <h2>Loading...</h2>
                ) : (
                    {state1}.map((x) =>
                        <div className="post" key={x.id}>
                            <div>{x.id}</div>
                            <div>{x.title}</div>
                            <div>{x.body}</div>
                        </div>
                    )
                )}
            </div>
        );
    }
}

const mapDispatchToProps = dispatch => ({
    {action1}: () => dispatch({action1}())
});

const mapStateToProps = state => ({
    {state1}: state.{reducer1}.{state1},
    {state2}: state.{reducer1}.{state2}
});

export default connect(mapStateToProps, mapDispatchToProps)({Component});
