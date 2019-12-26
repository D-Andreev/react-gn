import {COMPONENT_NAME_PLACEHOLDER, TEMPLATE_OPTIONS} from '../../../constants';

const main: any = [
    {path: `${COMPONENT_NAME_PLACEHOLDER}.jsx.ejs`},
    {path: `${COMPONENT_NAME_PLACEHOLDER}.styles.css.ejs`},
    {path: `${COMPONENT_NAME_PLACEHOLDER}.test.js.ejs`}
];
const mainTs: any = [
    {path: `${COMPONENT_NAME_PLACEHOLDER}.ts.ejs`},
    {path: `${COMPONENT_NAME_PLACEHOLDER}.styles.css.ejs`},
    {path: `${COMPONENT_NAME_PLACEHOLDER}.test.ts.ejs`}
];
const styledComponents: any = [
    {path: `Styled${COMPONENT_NAME_PLACEHOLDER}.js.ejs`}
];
const styledComponentsTs: any = [
    {path: `Styled${COMPONENT_NAME_PLACEHOLDER}.ts.ejs`}
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
                {path: './actions/actions.js.ejs'},
                {path: './reducers/reducer.js.ejs'}
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
                {path: './actions/actions.ts.ejs'},
                {path: './reducers/reducer.ts.ejs'}
            ],
        }
    }
};

export default templateDefinition;
