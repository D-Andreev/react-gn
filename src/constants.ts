export const SDK_NAME = 'react-sdk';

export const COMMAND = {
    INIT: 'init',
    UNKNOWN: 'unknown',
};

export const COMMAND_FLAG = {
    JS: '--js',
    TS: '--ts',
    HELP: '--help',
    VERSION: '--version',
};

export const MAIN_COMMANDS = ['init', 'create'];
export const ALLOWED_FLAGS = ['--js', '--ts', '--config', '--withCra', '--ejected'];

export const ALLOWED_FLAGS_DESCRIPTIONS: {[flag: string]: string} = {
    '--help': 'Shows the help.',
    '--js': 'Create a javascript app.',
    '--ts': 'Create a typescript app.',
    '--config': 'File path to config file.',
};
export const MAIN_COMMANDS_DESCRIPTIONS: {[flag: string]: string} = {
    'init': 'Initialize react application. (react-sdk init my-app)',
    'create': 'Create react component. (react-sdk create my-component)',
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

export const FLAGS_MIN_INDEX = 3;

export const FLAG_INDICATOR = '--';

export const ERROR = {
    INVALID_OUTPUT: 'InvalidOutput',
};

export const OUTPUT_TYPE = {
    NORMAL: 'normal',
    INFO: 'info',
    SUCCESS: 'success',
};

export const DEFAULT_CONFIG = {
    language: 'js',
    withCra: true,
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
