const Template: any = {
    dependencies: {
        js: {
            propTypes: [
                {name: 'prop-types'},
            ],
            styledComponents: [
                {name: 'styled-components'},
            ],
        },
        ts: {
            propTypes: [
                {name: 'prop-types'},
                {name: '@types/prop-types'}
            ],
            styledComponents: [
                {name: 'styled-components'},
                {name: '@types/styled-components'}
            ]
        },
    },
    js: {
        component: {
            main: ['Counter.jsx', 'Counter.styles.css', 'Counter.test.js'],
            withStyledComponents: ['./StyledButton.js']
        },
        container: {
            main: ['Counter.jsx', 'Counter.styles.css', 'Counter.test.js'],
            withStyledComponents: ['./StyledCounter.js'],
            withRedux: ['./actions/counterActions.js', './reducers/counterReducer.js'],
        }
    },
    ts: {
        component: {
            main: ['Counter.jsx', 'Counter.styles.css', 'Counter.test.js'],
            withStyledComponents: ['./StyledButton.ts']
        },
        container: {
            main: ['Counter.jsx', 'Counter.styles.css', 'Counter.test.js'],
            withStyledComponents: ['./StyledCounter.ts'],
            withRedux: ['./actions/counterActions.ts', './actions/counterActions.ts/reducers/counterReducer.ts'],
        }
    }
};

export default Template;
