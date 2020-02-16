import IWizard from '../interfaces/IWizard';
import {
    NEW_COMMAND_QUESTIONS,
    NEW_COMMAND_QUESTION_MESSAGES,
    GENERATE_COMMAND_QUESTION_MESSAGES,
    GENERATE_COMMAND_QUESTIONS,
    GENERATE_QUESTION_NAME,
    STYLING_OPTIONS,
    TEMPLATE_COMMAND_QUESTIONS,
    TEMPLATE_QUESTION_NAME
} from './questionsDefiinition';
import {Answers, Question} from 'inquirer';
import {LANGUAGE_TYPE} from '../../constants';
import ITemplateAnswers from '../../commands/interfaces/ITemplateAnswers';
import IGenerateAnswers from '../../commands/interfaces/IGenerateAnswers';
import { PathPrompt } from 'inquirer-path';
import {toPascalCase} from '../../utils';

class Wizard implements IWizard {
    private readonly inquirer: typeof import('inquirer');

    constructor(inquirer: typeof import('inquirer')) {
        this.inquirer = inquirer;
        this.inquirer.registerPrompt('path', PathPrompt);
    }

    private prompt(questions: Question[], done: Function): void {
        this.inquirer.prompt(questions)
            .then(answers => done(null, answers))
            .catch(err => done(err));
    }

    askNewCommandQuestions(done: Function): void {
        this.prompt(NEW_COMMAND_QUESTIONS, (err: Error, results: Answers) => {
            if (err) {
                return done(err);
            }
            done(null, {
                languageType: results.options.indexOf(NEW_COMMAND_QUESTION_MESSAGES.USE_TS) !== -1 ?
                    LANGUAGE_TYPE.TS : LANGUAGE_TYPE.JS,
                withRedux: results.options.indexOf(NEW_COMMAND_QUESTION_MESSAGES.USE_REDUX) !== -1,
                ejected: results.options.indexOf(NEW_COMMAND_QUESTION_MESSAGES.EJECT_APP) !== -1
            });
        });
    }

    askGenerateCommandQuestions(done: Function): void {
        this.prompt(GENERATE_COMMAND_QUESTIONS, (err: Error, results: Answers) => {
            if (err) {
                return done(err);
            }
            const answers: IGenerateAnswers = {
                targetPath: results[GENERATE_QUESTION_NAME.TARGET_PATH] !== './' ?
                    results[GENERATE_QUESTION_NAME.TARGET_PATH] : process.cwd(),
                componentDirName: results[GENERATE_QUESTION_NAME.COMPONENT_DIR_NAME],
                componentName: toPascalCase(results[GENERATE_QUESTION_NAME.COMPONENT_DIR_NAME]),
                languageType: results[GENERATE_QUESTION_NAME.USE_TS] ? LANGUAGE_TYPE.TS : LANGUAGE_TYPE.JS,
                isClassComponent: results[GENERATE_QUESTION_NAME.IS_CLASS_COMPONENT],
                withPropTypes:
                    results[GENERATE_QUESTION_NAME.OPTIONS]
                        .indexOf(GENERATE_COMMAND_QUESTION_MESSAGES.WITH_PROP_TYPES) !== -1,
                withCss: results[GENERATE_QUESTION_NAME.STYLING] === STYLING_OPTIONS.WITH_CSS,
                withSass: results[GENERATE_QUESTION_NAME.STYLING] === STYLING_OPTIONS.WITH_SASS,
                withLess: results[GENERATE_QUESTION_NAME.STYLING] === STYLING_OPTIONS.WITH_LESS,
                withStyledComponents:
                    results[GENERATE_QUESTION_NAME.STYLING] === STYLING_OPTIONS.WITH_STYLED_COMPONENTS,
                withState: results[GENERATE_QUESTION_NAME.OPTIONS]
                    .indexOf(GENERATE_COMMAND_QUESTION_MESSAGES.WITH_STATE) !== -1,
                withRedux: results[GENERATE_QUESTION_NAME.OPTIONS]
                    .indexOf(GENERATE_COMMAND_QUESTION_MESSAGES.WITH_REDUX) !== -1,
                withHooks: results[GENERATE_QUESTION_NAME.OPTIONS]
                    .indexOf(GENERATE_COMMAND_QUESTION_MESSAGES.WITH_HOOKS) !== -1,
            };

            done(null, answers);
        });
    }

    askTemplateCommandQuestions(done: Function): void {
        this.prompt(TEMPLATE_COMMAND_QUESTIONS, (err: Error, results: Answers) => {
            if (err) {
                return done(err);
            }
            const answers: ITemplateAnswers = {
                templatePath: results[TEMPLATE_QUESTION_NAME.TEMPLATE_PATH],
                targetPath: results[TEMPLATE_QUESTION_NAME.TARGET_DIR] !== './' ?
                    results[TEMPLATE_QUESTION_NAME.TARGET_DIR] : process.cwd(),
                componentDirName: results[TEMPLATE_QUESTION_NAME.COMPONENT_DIR_NAME],
                componentName: toPascalCase(results[TEMPLATE_QUESTION_NAME.COMPONENT_DIR_NAME]),
            };
            done(null, answers);
        });
    }
}

export default Wizard;
