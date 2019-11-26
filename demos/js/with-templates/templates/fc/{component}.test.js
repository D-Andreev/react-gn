import React from 'react';
import ReactDOM from 'react-dom';
import {component} from './{Component}';

it('renders without crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(<{component} />, div);
    ReactDOM.unmountComponentAtNode(div);
});
