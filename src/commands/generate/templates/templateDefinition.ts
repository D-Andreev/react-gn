import {COMPONENT_NAME_PLACEHOLDER, TEMPLATE_OPTIONS} from '../../../constants';

const main: any = [
    {path: `${COMPONENT_NAME_PLACEHOLDER}.ejs`, extension: 'jsx'},
    {path: `${COMPONENT_NAME_PLACEHOLDER}.styles.ejs`, extension: 'css'},
    {path: `${COMPONENT_NAME_PLACEHOLDER}.test.ejs`, extension: 'js'}
];
const mainTs: any = [
    {path: `${COMPONENT_NAME_PLACEHOLDER}.ejs`, extension: 'tsx'},
    {path: `${COMPONENT_NAME_PLACEHOLDER}.styles.ejs`, extension: 'css'},
    {path: `${COMPONENT_NAME_PLACEHOLDER}.test.ejs`, extension: 'ts'}
];
const styledComponents: any = [
    {path: `Styled${COMPONENT_NAME_PLACEHOLDER}.ejs`, extension: 'js'}
];
const styledComponentsTs: any = [
    {path: `Styled${COMPONENT_NAME_PLACEHOLDER}.ejs`, extension: 'ts'}
];
const templateDefinition: any = {
    js: {
        component: {
            main,
            [TEMPLATE_OPTIONS.WITH_STYLED_COMPONENTS]: styledComponents
        },
        container: {
            main,
            [TEMPLATE_OPTIONS.WITH_STYLED_COMPONENTS]: styledComponents,
            [TEMPLATE_OPTIONS.WITH_REDUX]: [
                {path: './actions/actions.ejs', extension: 'js'},
                {path: './reducers/reducer.ejs', extension: 'js'}
            ],
        }
    },
    ts: {
        component: {
            main: mainTs,
            [TEMPLATE_OPTIONS.WITH_STYLED_COMPONENTS]: styledComponentsTs,
        },
        container: {
            main: mainTs,
            [TEMPLATE_OPTIONS.WITH_STYLED_COMPONENTS]: styledComponentsTs,
            [TEMPLATE_OPTIONS.WITH_REDUX]: [
                {path: './actions/actions.ejs', extension: 'ts'},
                {path: './reducers/reducer.ejs', extension: 'ts'}
            ],
        }
    }
};

export default templateDefinition;
