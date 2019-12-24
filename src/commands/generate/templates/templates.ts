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
            withStyledComponents: [{path: 'StyledButton.ejs', extension: 'js'}]
        },
        container: {
            main: main,
            withStyledComponents: [{path: 'StyledButton.ejs', extension: 'js'}],
            withRedux: [
                {path: './actions/counterActions.ejs', extension: 'js'},
                {path: './reducers/counterReducer.ejs', extension: 'js'}
            ],
        }
    },
    ts: {
        component: {
            main: main,
            withStyledComponents: [{path: 'StyledButton.ejs', extension: 'js'}]
        },
        container: {
            main: main,
            withStyledComponents: [{path: 'StyledButton.ejs', extension: 'js'}],
            withRedux: [
                {path: './actions/counterActions.ejs', extension: 'js'},
                {path: './reducers/counterReducer.ejs', extension: 'js'}
            ],
        }
    }
};

export default Template;
