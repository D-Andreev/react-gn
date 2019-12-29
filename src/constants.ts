export const PACKAGE_NAME = 'react-gn';
export const PACKAGE_VERSION = '1.0.21';
export const DEFAULT_COMPONENT_NAME = 'MyComponent';
export const COMPONENT_NAME_PLACEHOLDER = '{Component}';

export const COMMAND = {
    NEW: 'new',
    UNKNOWN: 'unknown',
    GENERATE: 'generate',
    TEMPLATE: 'template'
};

export const COMMAND_FLAG = {
    JS: '--js',
    TS: '--ts',
    HELP: '--help',
    VERSION: '--version',
    CONFIG: '--config',
    EJECTED: '--ejected',
    COMPONENT_TARGET_PATH: '--path',
    TEMPLATE_PATH: '--template',
    COMPONENT_NAME: '--name',
    INTERACTIVE: '--interactive',
    WITH_STATE: '--withState',
    WITH_PROP_TYPES: '--withPropTypes',
    IS_CLASS_COMPONENT: '--isClass',
    WITH_HOOKS: '--withHooks',
    WITH_CSS: '--withCss',
    WITH_SASS: '--withSass',
    WITH_LESS: '--withLess',
    WITH_STYLED_COMPONENTS: '--withStyledComponents',
    DATA_PATH: '--data',
};

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
export const MAIN_COMMAND_ALIAS = {
    [COMMAND.NEW]: 'n',
    [COMMAND.TEMPLATE]: 't',
    [COMMAND.GENERATE]: 'g',
}
export const COMMAND_ALIAS: {[alias: string]: string} = {
    '-h': COMMAND_FLAG.HELP,
    '-v': COMMAND_FLAG.VERSION,
    '-c': COMMAND_FLAG.CONFIG,
    '-e': COMMAND_FLAG.EJECTED,
    '-p': COMMAND_FLAG.COMPONENT_TARGET_PATH,
    '-t': COMMAND_FLAG.TEMPLATE_PATH,
    '-n': COMMAND_FLAG.COMPONENT_NAME,
    '-i': COMMAND_FLAG.INTERACTIVE,
    '-s': ENUMERABLE_FLAGS[0],
    '-a': ENUMERABLE_FLAGS[1],
    '-r': ENUMERABLE_FLAGS[2],
    '-wr': FLAGS_WITH_TEMPLATES.WITH_REDUX,
    '-ws': COMMAND_FLAG.WITH_STATE,
    '-wpt': COMMAND_FLAG.WITH_PROP_TYPES,
    '-wcss': COMMAND_FLAG.WITH_CSS,
    '-wsass': COMMAND_FLAG.WITH_SASS,
    '-wless': COMMAND_FLAG.WITH_LESS,
    '-wsc': COMMAND_FLAG.WITH_STYLED_COMPONENTS,
    '-wh': COMMAND_FLAG.WITH_HOOKS,
    '-class': COMMAND_FLAG.IS_CLASS_COMPONENT,
    '-d': COMMAND_FLAG.DATA_PATH
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
    HELP: '    __  __________    ____ \n' +
        '   / / / / ____/ /   / __ \\\n' +
        '  / /_/ / __/ / /   / /_/ /\n' +
        ' / __  / /___/ /___/ ____/ \n' +
        '/_/ /_/_____/_____/_/      \n' +
        '                           ',
    LOGO: ' _ __ ___  __ _  ___| |_       __ _ _ __  \n' +
        '| \'__/ _ \\/ _` |/ __| __|____ / _` | \'_ \\ \n' +
        '| | |  __/ (_| | (__| ||_____| (_| | | | |\n' +
        '|_|  \\___|\\__,_|\\___|\\__|     \\__, |_| |_|\n' +
        '                              |___/       '
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
    ERROR: 'error',
    WARN: 'warning'
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
    WITH_CSS: 'withCss',
    WITH_SASS: 'withSass',
    WITH_LESS: 'withLess',
    WITH_STYLED_COMPONENTS: 'withStyledComponents',
    WITH_PROP_TYPES: 'withPropTypes',
    WITH_REDUX: 'withRedux',
};

export const PRETTIFIABLE_EXTENSIONS = ['js', 'jsx', 'ts', 'tsx'];

export const COMPONENT_TYPE = {
    CONTAINER: 'container',
    COMPONENT: 'component'
}
