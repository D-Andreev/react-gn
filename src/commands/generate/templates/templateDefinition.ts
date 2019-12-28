import {COMPONENT_NAME_PLACEHOLDER, TEMPLATE_OPTIONS} from '../../../constants';
import ITemplateFile from '../../interfaces/ITemplateFile';

const main: any = [
    {path: `${COMPONENT_NAME_PLACEHOLDER}.jsx.ejs`},
    {path: `${COMPONENT_NAME_PLACEHOLDER}.test.js.ejs`}
];
const mainTs: any = [
    {path: `${COMPONENT_NAME_PLACEHOLDER}.tsx.ejs`},
    {path: `${COMPONENT_NAME_PLACEHOLDER}.test.ts.ejs`}
];
const styledComponents: any = [
    {path: `Styled${COMPONENT_NAME_PLACEHOLDER}.js.ejs`}
];
const styledComponentsTs: any = [
    {path: `Styled${COMPONENT_NAME_PLACEHOLDER}.ts.ejs`}
];
const css: ITemplateFile = {path: `${COMPONENT_NAME_PLACEHOLDER}.styles.css.ejs`};
const sass: ITemplateFile = {path: `${COMPONENT_NAME_PLACEHOLDER}.sass.ejs`};
const less: ITemplateFile = {path: `${COMPONENT_NAME_PLACEHOLDER}.less.ejs`};

const templateDefinition: any = {
    js: {
        component: {
            main,
            [TEMPLATE_OPTIONS.WITH_CSS]: css,
            [TEMPLATE_OPTIONS.WITH_SASS]: sass,
            [TEMPLATE_OPTIONS.WITH_LESS]: less,
            [TEMPLATE_OPTIONS.WITH_STYLED_COMPONENTS]: styledComponents,
        },
        container: {
            main,
            [TEMPLATE_OPTIONS.WITH_CSS]: css,
            [TEMPLATE_OPTIONS.WITH_SASS]: sass,
            [TEMPLATE_OPTIONS.WITH_LESS]: less,
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
            [TEMPLATE_OPTIONS.WITH_CSS]: css,
            [TEMPLATE_OPTIONS.WITH_SASS]: sass,
            [TEMPLATE_OPTIONS.WITH_LESS]: less,
            [TEMPLATE_OPTIONS.WITH_STYLED_COMPONENTS]: styledComponentsTs,
        },
        container: {
            main: mainTs,
            [TEMPLATE_OPTIONS.WITH_CSS]: css,
            [TEMPLATE_OPTIONS.WITH_SASS]: sass,
            [TEMPLATE_OPTIONS.WITH_LESS]: less,
            [TEMPLATE_OPTIONS.WITH_STYLED_COMPONENTS]: styledComponentsTs,
            [TEMPLATE_OPTIONS.WITH_REDUX]: [
                {path: './actions/actions.ts.ejs'},
                {path: './reducers/reducer.ts.ejs'}
            ],
        }
    }
};

export default templateDefinition;
