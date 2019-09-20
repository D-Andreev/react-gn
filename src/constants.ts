export const SDK_NAME = 'react-sdk';

export const COMMAND = {
    INIT: 'init',
    UNKNOWN: 'unknown',
};

export const COMMAND_FLAG = {
    JS: '--js',
    TS: '--ts',
};

export const ALLOWED_FLAGS = ['--js', '--ts'];

export const ERROR = {
    INVALID_APP_NAME: 'InvalidAppName',
    INVALID_COMMAND: 'InvalidCommand',
};

export const SERVICE_IDENTIFIER = {
    IStorage: Symbol.for('IStorage'),
    ICommand: Symbol.for('ICommand'),
    IJsAppCommand: Symbol.for('IJsAppCommand'),
    ITsAppCommand: Symbol.for('ITsAppCommand'),
};
