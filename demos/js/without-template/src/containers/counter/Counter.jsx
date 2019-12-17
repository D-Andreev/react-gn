import React, {PureComponent} from 'react';
import { connect } from 'react-redux';
import { count } from './actions/counterAction';
import './Counter.css';
import StyledCounter from './StyledCounter';
import Counter from '../../components/counter/Counter';

class CounterContainer extends PureComponent {
    onClick = () => {
        console.log(this.props)
        this.props.count(this.props.currentCount);
    };

    render() {
        const { currentCount } = this.props;
        return (
            <StyledCounter primary>
                <div>Container counter</div>
                <div>
                    <p>You clicked {currentCount} times</p>
                    <button onClick={this.onClick}>
                        Click me
                    </button>
                </div>
                <div>Component counter</div>
                <Counter className='counter'/>
            </StyledCounter>
        );
    }
}

const mapDispatchToProps = dispatch => ({
    count: (currentCount) => dispatch(count(currentCount))
});

const mapStateToProps = state => ({
    currentCount: state.count.currentCount,
});

export default connect(mapStateToProps, mapDispatchToProps)(CounterContainer);
