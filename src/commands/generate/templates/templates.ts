const main: any = [
    {path: 'Counter.ejs', extension: 'jsx'},
    {path: 'Counter.styles.ejs', extension: 'css'},
    {path: 'Counter.test.ejs', extension: 'js'}
];

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
            main: main,
            withStyledComponents: [{path: 'StyledButton', extension: 'js'}]
        },
        container: {
            main: main,
            withStyledComponents: [{path: 'StyledButton', extension: 'js'}],
            withRedux: [
                {path: './actions/counterActions', extension: 'js'},
                {path: './reducers/counterReducer', extension: 'js'}
            ],
        }
    },
    ts: {
        component: {
            main: main,
            withStyledComponents: [{path: 'StyledButton', extension: 'js'}]
        },
        container: {
            main: main,
            withStyledComponents: [{path: 'StyledButton', extension: 'js'}],
            withRedux: [
                {path: './actions/counterActions', extension: 'js'},
                {path: './reducers/counterReducer', extension: 'js'}
            ],
        }
    }
};

export default Template;
