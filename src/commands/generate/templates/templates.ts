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
        functionalComponent: {
            main: ['Counter.jsx', 'Counter.styles.css', 'Counter.test.js'],
            withStyledComponents: ['./StyledButton.js']
        },
        classComponent: {
            main: ['Counter.jsx', 'Counter.styles.css', 'Counter.test.js'],
            withStyledComponents: ['./StyledCounter.js'],
            withRedux: ['./actions/counterActions.js', './reducers/counterReducer.js'],
        }
    },
    ts: {
        functionalComponent: {
            main: ['Counter.jsx', 'Counter.styles.css', 'Counter.test.js'],
            withStyledComponents: ['./StyledButton.ts']
        },
        classComponent: {
            main: ['Counter.jsx', 'Counter.styles.css', 'Counter.test.js'],
            withStyledComponents: ['./StyledCounter.ts'],
            withRedux: ['./actions/counterActions.ts', './actions/counterActions.ts/reducers/counterReducer.ts'],
        }
    }
};

export default Template;
