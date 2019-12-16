import React from 'react';
import ReactDOM from 'react-dom';
import Counter from './Counter';
import configureStore from 'redux-mock-store'

it('renders without crashing', () => {
    const mockStore = configureStore();
    const store = mockStore({count: {}});
    const div = document.createElement('div');
    ReactDOM.render(<Counter store={store} />, div);
    ReactDOM.unmountComponentAtNode(div);
});
