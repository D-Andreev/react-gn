import {COMPONENT_NAME_PLACEHOLDER, TEMPLATE_OPTIONS} from '../../../constants';

const main: any = [
    {path: `${COMPONENT_NAME_PLACEHOLDER}.ejs`},
    {path: `${COMPONENT_NAME_PLACEHOLDER}.styles.ejs`},
    {path: `${COMPONENT_NAME_PLACEHOLDER}.test.ejs`}
];
const mainTs: any = [
    {path: `${COMPONENT_NAME_PLACEHOLDER}.ejs`},
    {path: `${COMPONENT_NAME_PLACEHOLDER}.styles.ejs`},
    {path: `${COMPONENT_NAME_PLACEHOLDER}.test.ejs`}
];
const styledComponents: any = [
    {path: `Styled${COMPONENT_NAME_PLACEHOLDER}.ejs`}
];
const styledComponentsTs: any = [
    {path: `Styled${COMPONENT_NAME_PLACEHOLDER}.ejs`}
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
                {path: './actions/actions.ejs'},
                {path: './reducers/reducer.ejs'}
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
                {path: './actions/actions.ejs'},
                {path: './reducers/reducer.ejs'}
            ],
        }
    }
};

export default templateDefinition;
