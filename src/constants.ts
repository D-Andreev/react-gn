import {CheckboxQuestion, ConfirmQuestion, InputQuestion} from 'inquirer';
import fs from 'fs';

export const PACKAGE_NAME = 'react-gn';
export const PACKAGE_VERSION = '1.0.21';
export const DEFAULT_COMPONENT_NAME = 'MyComponent';
export const COMPONENT_NAME_PLACEHOLDER = '{Component}';

export const COMMAND = {
    NEW: 'new',
    UNKNOWN: 'unknown',
    GENERATE: 'generate',
};

export const COMMAND_FLAG = {
    JS: '--js',
    TS: '--ts',
    HELP: '--help',
    VERSION: '--version',
    CONFIG: '--config',
    EJECTED: '--ejected',
    TEMPLATE: '--template',
    COMPONENT_TARGET_PATH: '--path',
    COMPONENT_NAME: '--name',
    INTERACTIVE: '--interactive',

    WITH_STATE: '--withState',
    WITH_PROP_TYPES: '--withPropTypes',
    WITH_STYLED_COMPONENTS: '--withStyledComponents',
    IS_CLASS_COMPONENT: '--isClass',
    WITH_HOOKS: '--withHooks'
};

export const NEW_COMMAND_QUESTION_MESSAGES = {
    USE_TS: 'Use Typescript',
    USE_REDUX: 'Use Redux',
    EJECT_APP: 'Eject the app',
};

export const NEW_COMMAND_QUESTIONS: CheckboxQuestion[] = [
    {
        type: 'checkbox',
        message: 'Select any of the following options',
        name: 'options',
        choices: [
            {
                name: NEW_COMMAND_QUESTION_MESSAGES.USE_TS
            },
            {
                name: NEW_COMMAND_QUESTION_MESSAGES.USE_REDUX
            },
            {
                name: NEW_COMMAND_QUESTION_MESSAGES.EJECT_APP
            }
        ]
    }
];

export const GENERATE_COMMAND_QUESTION_MESSAGES = {
    TARGET_DIR: 'Enter the target dir for the component.',
    USE_TS: 'Use typescript?',
    COMPONENT_NAME: 'Enter component name.',
    IS_CLASS_COMPONENT: 'Is a class component?',
    WITH_HOOKS: 'Use hooks',
    WITH_REDUX: 'Use Redux?',
    WITH_STATE: 'Use state?',
    WITH_PROP_TYPES: 'Use propTypes?',
    WITH_STYLED_COMPONENTS: 'Use styled components?',
};

export const GENERATE_COMMON_CHOICES = [
    { name: GENERATE_COMMAND_QUESTION_MESSAGES.WITH_REDUX },
    { name: GENERATE_COMMAND_QUESTION_MESSAGES.WITH_PROP_TYPES },
    { name: GENERATE_COMMAND_QUESTION_MESSAGES.WITH_STYLED_COMPONENTS },
];

export const GENERATE_QUESTION_NAME = {
    TARGET_PATH: 'targetPath',
    COMPONENT_NAME: 'componentName',
    USE_TS: 'useTs',
    IS_CLASS_COMPONENT: 'isClassComponent',
    OPTIONS: 'options',
};

export const GENERATE_COMMAND_QUESTIONS: (CheckboxQuestion | InputQuestion | ConfirmQuestion)[] = [
    {
        type: 'input',
        name: GENERATE_QUESTION_NAME.TARGET_PATH,
        message: GENERATE_COMMAND_QUESTION_MESSAGES.TARGET_DIR,
        default: './',
        validate: (input: any): boolean | string | Promise<boolean | string> => {
            if (!fs.existsSync(input)) {
                return 'Please enter an existing directory.'
            }

            return true;
        }
    },
    {
        type: 'input',
        name: GENERATE_QUESTION_NAME.COMPONENT_NAME,
        message: GENERATE_COMMAND_QUESTION_MESSAGES.COMPONENT_NAME,
        default: DEFAULT_COMPONENT_NAME
    },
    {
        type: 'confirm',
        name: GENERATE_QUESTION_NAME.USE_TS,
        message: GENERATE_COMMAND_QUESTION_MESSAGES.USE_TS,
        default: false
    },
    {
        type: 'confirm',
        name: GENERATE_QUESTION_NAME.IS_CLASS_COMPONENT,
        message: GENERATE_COMMAND_QUESTION_MESSAGES.IS_CLASS_COMPONENT,
        default: false,
    },
    {
        type: 'checkbox',
        message: 'Select any of the following options.',
        name: GENERATE_QUESTION_NAME.OPTIONS,
        choices: [
            { name: GENERATE_COMMAND_QUESTION_MESSAGES.WITH_HOOKS },
            ...GENERATE_COMMON_CHOICES,
        ],
        when: function(answers) {
            return !answers[GENERATE_QUESTION_NAME.IS_CLASS_COMPONENT];
        }
    },
    {
        type: 'checkbox',
        message: 'Select any of the following options.',
        name: GENERATE_QUESTION_NAME.OPTIONS,
        choices: [
            { name: GENERATE_COMMAND_QUESTION_MESSAGES.WITH_STATE },
            ...GENERATE_COMMON_CHOICES
        ],
        when: function(answers) {
            return answers[GENERATE_QUESTION_NAME.IS_CLASS_COMPONENT];
        }
    }
];

export const ENUMERABLE_FLAG_ID = '[]';
export const ENUMERABLE_FLAGS = [
    `--state${ENUMERABLE_FLAG_ID}`,
    `--action${ENUMERABLE_FLAG_ID}`,
    `--reducer${ENUMERABLE_FLAG_ID}`
];
export const MAIN_COMMANDS = ['new', 'generate'];
export const ALLOWED_LANGUAGE_TYPE_FLAGS = ['--js', '--ts'];
export const FLAGS_WITH_TEMPLATES = {
    WITH_REDUX: '--withRedux',
};
export const FLAGS_WITH_TEMPLATES_WITH_REDUX_NAME = {
    [FLAGS_WITH_TEMPLATES.WITH_REDUX]: 'Redux',
};
export const ALIAS: {[key: string]: string} = {
    HELP: '-h',
};
export const COMMAND_ALIAS: {[alias: string]: string} = {
    '-h': COMMAND_FLAG.HELP,
    '-v': COMMAND_FLAG.VERSION,
    '-c': COMMAND_FLAG.CONFIG,
    '-e': COMMAND_FLAG.EJECTED,
    '-t': COMMAND_FLAG.TEMPLATE,
    '-p': COMMAND_FLAG.COMPONENT_TARGET_PATH,
    '-n': COMMAND_FLAG.COMPONENT_NAME,
    '-i': COMMAND_FLAG.INTERACTIVE,
    '-s': ENUMERABLE_FLAGS[0],
    '-a': ENUMERABLE_FLAGS[1],
    '-r': ENUMERABLE_FLAGS[2],
    '-wr': FLAGS_WITH_TEMPLATES.WITH_REDUX,
    '-ws': COMMAND_FLAG.WITH_STATE,
    '-wpt': COMMAND_FLAG.WITH_PROP_TYPES,
    '-wsc': COMMAND_FLAG.WITH_STYLED_COMPONENTS,
    '-wh': COMMAND_FLAG.WITH_HOOKS,
    '-class': COMMAND_FLAG.IS_CLASS_COMPONENT,
};
export const ALLOWED_FLAGS = ['--config', '--ejected', '--interactive']
    .concat(Object.values(FLAGS_WITH_TEMPLATES))
    .concat(ALLOWED_LANGUAGE_TYPE_FLAGS);

export const ALLOWED_FLAGS_DESCRIPTIONS: {[flag: string]: string} = {
    '--help (Alias: -h)': 'Shows the help.',
    '--version (Alias: -v)': 'Shows the current version.',
    '--interactive (Alias: -i)': 'When false, disables interactive input prompts.',
    '--withState (Alias: -ws)': 'When true, adds state to the component.',
    '--withHooks (Alias: -wh)': 'When true, adds state to the component.',
};
export const MAIN_COMMANDS_DESCRIPTIONS: {[flag: string]: string} = {
    'new': 'Create a new react application.',
    'generate': 'Generate a new component.',
};

export const ASCII_ART = {
    HELP: ' _    _      _       \n' +
        '| |  | |    | |      \n' +
        '| |__| | ___| |_ __  \n' +
        '|  __  |/ _ \\ | \'_ \\ \n' +
        '| |  | |  __/ | |_) |\n' +
        '|_|  |_|\\___|_| .__/ \n' +
        '              | |    \n' +
        '              |_|    '
};

export const NEW_COMPONENT_MESSAGE = {
    INVALID_NAME: 'Please provide a name for the new component.',
    CREATE_SUCCESS: 'Component was created successfully!',
    INVALID_PATH: 'Target path is invalid.',
    INVALID_TEMPLATE_PATH: 'Invalid template path.',
};

export const FLAGS_MIN_INDEX = 3;

export const FLAG_INDICATOR = '--';

export const ERROR = {
    INVALID_OUTPUT: 'InvalidOutput',
};

export const OUTPUT_TYPE = {
    NORMAL: 'normal',
    INFO: 'info',
    SUCCESS: 'success',
    ERROR: 'error'
};

export const LANGUAGE_TYPE = {
    JS: 'js',
    TS: 'ts',
};

export const CRA_EVENT = {
    INIT_ERROR: 'INIT_ERROR',
    INIT_DATA: 'INIT_DATA',
    INIT_CLOSE: 'INIT_CLOSE',
    EJECT_ERROR: 'EJECT_ERROR',
    EJECT_DATA: 'EJECT_DATA',
    EJECT_CLOSE: 'EJECT_CLOSE'
};

export const TEMPLATE_OPTIONS = {
    WITH_STYLED_COMPONENTS: 'withStyledComponents',
    WITH_PROP_TYPES: 'withPropTypes',
    WITH_REDUX: 'withRedux',
};

export const PRETTIFIABLE_EXTENSIONS = ['js', 'jsx', 'ts', 'tsx'];
