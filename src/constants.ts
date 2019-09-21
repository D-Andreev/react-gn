export const SDK_NAME = 'react-sdk';

export const COMMAND = {
    INIT: 'init',
    UNKNOWN: 'unknown',
};

export const COMMAND_FLAG = {
    JS: '--js',
    TS: '--ts',
    HELP: '--help'
};

export const MAIN_COMMANDS = ['init', 'create'];
export const ALLOWED_FLAGS = ['--js', '--ts', '--config'];

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
    HELP: '        .______       _______     ___       ______ .___________.         _______. _______   __  ___     __    __   _______  __      .______   \n' +
        '        |   _  \\     |   ____|   /   \\     /      ||           |        /       ||       \\ |  |/  /    |  |  |  | |   ____||  |     |   _  \\  \n' +
        '        |  |_)  |    |  |__     /  ^  \\   |  ,----\'`---|  |----`______ |   (----`|  .--.  ||  \'  /     |  |__|  | |  |__   |  |     |  |_)  | \n' +
        '        |      /     |   __|   /  /_\\  \\  |  |         |  |    |______| \\   \\    |  |  |  ||    <      |   __   | |   __|  |  |     |   ___/  \n' +
        '        |  |\\  \\----.|  |____ /  _____  \\ |  `----.    |  |         .----)   |   |  \'--\'  ||  .  \\     |  |  |  | |  |____ |  `----.|  |      \n' +
        '        | _| `._____||_______/__/     \\__\\ \\______|    |__|         |_______/    |_______/ |__|\\__\\    |__|  |__| |_______||_______|| _|      \n' +
        '                                                                                                                                              '
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
