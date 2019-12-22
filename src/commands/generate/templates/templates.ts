export default {
    dependencies: {
        js: {
            propTypes: [
                {name: 'prop-types'},
            ],
            styledComponents: [
                {name: 'styledComponents'},
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
            styledComponents: ['./StyledButton.js']
        },
        classComponent: {
            styledComponents: ['./StyledCounter.js'],
            redux: ['./actions/counterActions.js', './reducers/counterReducer.js'],
        }
    },
    ts: {
        functionalComponent: {
            styledComponents: ['./StyledButton.ts']
        },
        classComponent: {
            styledComponents: ['./StyledCounter.ts'],
            redux: ['./actions/counterActions.ts', './reducers/counterReducer.ts'],
        }
    }
}
