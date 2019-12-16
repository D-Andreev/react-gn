import React, { useState, useEffect, useReducer } from 'react';
import simpleReducer from '../../reducers/simpleReducer';
import PropTypes from 'prop-types';
import StyledButton from './StyledButton';
import './Counter.css';


function Counter({className = ''}) {
    const [count, setCount] = useState(0);
    const [result] = useReducer(simpleReducer);

    useEffect(() => {
        document.title = `You clicked ${count} times`;
    });

    return (
        <div className={className}>
            <p>You clicked {count} times</p>
            <StyledButton onClick={() => setCount(count + 1)} primary>
                Click me
            </StyledButton>
            <pre>
                {result}
            </pre>
        </div>
    );
}

Counter.propTypes = {
    className: PropTypes.string
};

export default React.memo(Counter);
