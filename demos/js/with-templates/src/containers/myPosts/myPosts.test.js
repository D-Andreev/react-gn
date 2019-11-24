import React from 'react';
import ReactDOM from 'react-dom';
import myPosts from './myPosts';

it('renders without crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(<myPosts />, div);
    ReactDOM.unmountComponentAtNode(div);
});
