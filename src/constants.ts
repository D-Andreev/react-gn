import {CheckboxQuestion} from 'inquirer';

export const PACKAGE_NAME = 'react-gn';
export const PACKAGE_VERSION = '1.0.20';

export const COMMAND = {
    NEW: 'new',
    UNKNOWN: 'unknown',
    COMPONENT: 'component',
};

export const AFFIRMATIVE_ANSWERS = ['y', 'yes'];

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
    INTERACTIVE: '--interactive'
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

export const ENUMERABLE_FLAG_ID = '[]';
export const ENUMERABLE_FLAGS = [
    `--state${ENUMERABLE_FLAG_ID}`,
    `--action${ENUMERABLE_FLAG_ID}`,
    `--reducer${ENUMERABLE_FLAG_ID}`
];
export const MAIN_COMMANDS = ['init', 'create'];
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
};
export const ALLOWED_FLAGS = ['--config', '--ejected', '--interactive']
    .concat(Object.values(FLAGS_WITH_TEMPLATES))
    .concat(ALLOWED_LANGUAGE_TYPE_FLAGS);

export const NON_PLACEHOLDER_FLAGS = [
    COMMAND_FLAG.COMPONENT_NAME,
    COMMAND_FLAG.TEMPLATE,
    COMMAND_FLAG.COMPONENT_TARGET_PATH,
].concat(ALLOWED_LANGUAGE_TYPE_FLAGS);

export const ALLOWED_FLAGS_DESCRIPTIONS: {[flag: string]: string} = {
    '--help (Alias: -h)': 'Shows the help.',
    '--version (Alias: -v)': 'Shows the help.',
    '--interactive (Alias: -i)': 'When false, disables interactive input prompts.',
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

export const DEFAULT_CONFIG = {
    language: LANGUAGE_TYPE.JS,
    ejected: false,
};

export const CRA_EVENT = {
    INIT_ERROR: 'INIT_ERROR',
    INIT_DATA: 'INIT_DATA',
    INIT_CLOSE: 'INIT_CLOSE',
    EJECT_ERROR: 'EJECT_ERROR',
    EJECT_DATA: 'EJECT_DATA',
    EJECT_CLOSE: 'EJECT_CLOSE'
};

export const RETURN_STATEMENT_MIN_MATCH_COUNT = 3;
