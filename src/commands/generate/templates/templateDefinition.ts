import {TEMPLATE_OPTIONS} from '../../../constants';

const main: any = [
    {path: 'Counter.ejs', extension: 'jsx'},
    {path: 'Counter.styles.ejs', extension: 'css'},
    {path: 'Counter.test.ejs', extension: 'js'}
];

const templateDefinition: any = {
    js: {
        component: {
            main,
            [TEMPLATE_OPTIONS.WITH_STYLED_COMPONENTS]: [
                {path: 'StyledButton.ejs', extension: 'js'}
            ]
        },
        container: {
            main,
            [TEMPLATE_OPTIONS.WITH_STYLED_COMPONENTS]: [
                {path: 'StyledButton.ejs', extension: 'js'}
            ],
            [TEMPLATE_OPTIONS.WITH_REDUX]: [
                {path: './actions/counterActions.ejs', extension: 'js'},
                {path: './reducers/counterReducer.ejs', extension: 'js'}
            ],
        }
    },
    ts: {
        component: {
            main,
            [TEMPLATE_OPTIONS.WITH_STYLED_COMPONENTS]: [
                {path: 'StyledButton.ejs', extension: 'js'}
            ]
        },
        container: {
            main,
            [TEMPLATE_OPTIONS.WITH_STYLED_COMPONENTS]: [
                {path: 'StyledButton.ejs', extension: 'js'}
            ],
            [TEMPLATE_OPTIONS.WITH_REDUX]: [
                {path: './actions/counterActions.ejs', extension: 'js'},
                {path: './reducers/counterReducer.ejs', extension: 'js'}
            ],
        }
    }
};

export default templateDefinition;
