import React, { useState, useEffect, useReducer } from 'react';
import simpleReducer from './path/to/your/reducer';

import PropTypes from 'prop-types';

import './TodoList.styles.css';

function TodoList({ children }) {
  const [count, setCount] = useState(0);
  const [result] = useReducer(simpleReducer);

  useEffect(() => {
    document.title = `You clicked ${count} times`;
  });

  return (
    <div>
      <p>You clicked {count} times</p>
      <button onClick={() => setCount(count + 1)} primary>
        Click me
      </button>
      <pre>{result}</pre>
    </div>
  );
}

TodoList.propTypes = {
  children: PropTypes.element
};

export default React.memo(TodoList);
