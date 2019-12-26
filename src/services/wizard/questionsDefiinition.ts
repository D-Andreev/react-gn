import {CheckboxQuestion, ConfirmQuestion, InputQuestion} from 'inquirer';
import * as fs from 'fs';
import {DEFAULT_COMPONENT_NAME} from '../../constants';

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