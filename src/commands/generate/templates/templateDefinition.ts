import {COMPONENT_NAME_PLACEHOLDER, TEMPLATE_OPTIONS} from '../../../constants';

const main: any = [
    {path: `${COMPONENT_NAME_PLACEHOLDER}.ejs`, extension: 'jsx'},
    {path: `${COMPONENT_NAME_PLACEHOLDER}.styles.ejs`, extension: 'css'},
    {path: `${COMPONENT_NAME_PLACEHOLDER}.test.ejs`, extension: 'js'}
];
const styledComponents: any = [
    {path: `Styled${COMPONENT_NAME_PLACEHOLDER}.ejs`, extension: 'js'}
];

const templateDefinition: any = {
    js: {
        component: {
            main,
            [TEMPLATE_OPTIONS.WITH_STYLED_COMPONENTS]: [
                {path: 'Styled{Component}.ejs', extension: 'js'}
            ]
        },
        container: {
            main,
            [TEMPLATE_OPTIONS.WITH_STYLED_COMPONENTS]: styledComponents,
            [TEMPLATE_OPTIONS.WITH_REDUX]: [
                {path: './actions/simpleActions.ejs', extension: 'js'},
                {path: './reducers/simpleReducer.ejs', extension: 'js'}
            ],
        }
    },
    ts: {
        component: {
            main,
            [TEMPLATE_OPTIONS.WITH_STYLED_COMPONENTS]: styledComponents,
        },
        container: {
            main,
            [TEMPLATE_OPTIONS.WITH_STYLED_COMPONENTS]: styledComponents,
            [TEMPLATE_OPTIONS.WITH_REDUX]: [
                {path: './actions/simpleActions.ejs', extension: 'js'},
                {path: './reducers/simpleReducer.ejs', extension: 'js'}
            ],
        }
    }
};

export default templateDefinition;
