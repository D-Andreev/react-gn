import React from 'react';
import ReactDOM from 'react-dom';
import posts from './posts';

it('renders without crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(<posts />, div);
    ReactDOM.unmountComponentAtNode(div);
});
