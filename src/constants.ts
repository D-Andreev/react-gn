export const PACKAGE_NAME = 'react-gn';
export const PACKAGE_VERSION = '1.0.16';

export const COMMAND = {
    INIT: 'init',
    UNKNOWN: 'unknown',
    COMPONENT: 'component',
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
};

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
export const COMMAND_ALIAS: {[alias: string]: string} = {
    '-h': COMMAND_FLAG.HELP,
    '-v': COMMAND_FLAG.VERSION,
    '-c': COMMAND_FLAG.CONFIG,
    '-e': COMMAND_FLAG.EJECTED,
    '-t': COMMAND_FLAG.TEMPLATE,
    '-p': COMMAND_FLAG.COMPONENT_TARGET_PATH,
    '-n': COMMAND_FLAG.COMPONENT_NAME,
    '-s': ENUMERABLE_FLAGS[0],
    '-a': ENUMERABLE_FLAGS[1],
    '-r': ENUMERABLE_FLAGS[2],
    '-wr': FLAGS_WITH_TEMPLATES.WITH_REDUX,
};
export const ALLOWED_FLAGS = ['--config', '--ejected']
    .concat(Object.values(FLAGS_WITH_TEMPLATES))
    .concat(ALLOWED_LANGUAGE_TYPE_FLAGS);

export const NON_PLACEHOLDER_FLAGS = [
    COMMAND_FLAG.COMPONENT_NAME,
    COMMAND_FLAG.TEMPLATE,
    COMMAND_FLAG.COMPONENT_TARGET_PATH,
].concat(ALLOWED_LANGUAGE_TYPE_FLAGS);

export const ALLOWED_FLAGS_DESCRIPTIONS: {[flag: string]: string} = {
    '--help': 'Shows the help.',
    '--js': 'Use javascript.',
    '--ts': 'Use typescript.',
    '--config': 'File path to config file.',
    '--ejected': 'Creates an already ejected app',
    '--withRedux': 'Add redux setup to the app',
};
export const MAIN_COMMANDS_DESCRIPTIONS: {[flag: string]: string} = {
    'init': `Initialize react application. (${PACKAGE_NAME} init my-app)`,
    'create': `Create react component. (${PACKAGE_NAME} create my-component)`,
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
