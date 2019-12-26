import IWizard from '../interfaces/IWizard';
import {
    NEW_COMMAND_QUESTIONS,
    NEW_COMMAND_QUESTION_MESSAGES,
    GENERATE_COMMAND_QUESTION_MESSAGES,
    GENERATE_COMMAND_QUESTIONS,
    GENERATE_QUESTION_NAME
} from './questionsDefiinition';
import {Answers, Question} from 'inquirer';
import INewAnswers from '../../commands/interfaces/INewAnswers';
import {LANGUAGE_TYPE} from '../../constants';

class Wizard implements IWizard {
    private readonly inquirer: typeof import('inquirer');

    constructor(inquirer: typeof import('inquirer')) {
        this.inquirer = inquirer;
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
            const answers: INewAnswers = {
                languageType: results.options.indexOf(NEW_COMMAND_QUESTION_MESSAGES.USE_TS) !== -1 ?
                    LANGUAGE_TYPE.TS : LANGUAGE_TYPE.JS,
                withRedux: results.options.indexOf(NEW_COMMAND_QUESTION_MESSAGES.USE_REDUX) !== -1,
                ejected: results.options.indexOf(NEW_COMMAND_QUESTION_MESSAGES.EJECT_APP) !== -1
            };
            done(null, answers);
        });
    }

    askGenerateCommandQuestions(done: Function): void {
        this.prompt(GENERATE_COMMAND_QUESTIONS, (err: Error, results: Answers) => {
            if (err) {
                return done(err);
            }

            done(null, {
                targetPath: results[GENERATE_QUESTION_NAME.TARGET_PATH] !== './' ?
                    results[GENERATE_QUESTION_NAME.TARGET_PATH] : process.cwd(),
                componentName: results[GENERATE_QUESTION_NAME.COMPONENT_NAME],
                languageType: results[GENERATE_QUESTION_NAME.USE_TS] ? LANGUAGE_TYPE.TS : LANGUAGE_TYPE.JS,
                isClassComponent: results[GENERATE_QUESTION_NAME.IS_CLASS_COMPONENT],
                withPropTypes:
                    results[GENERATE_QUESTION_NAME.OPTIONS]
                        .indexOf(GENERATE_COMMAND_QUESTION_MESSAGES.WITH_PROP_TYPES) !== -1,
                withStyledComponents:
                    results[GENERATE_QUESTION_NAME.OPTIONS]
                        .indexOf(GENERATE_COMMAND_QUESTION_MESSAGES.WITH_STYLED_COMPONENTS) !== -1,
                withState: results[GENERATE_QUESTION_NAME.OPTIONS]
                    .indexOf(GENERATE_COMMAND_QUESTION_MESSAGES.WITH_STATE) !== -1,
                withRedux: results[GENERATE_QUESTION_NAME.OPTIONS]
                    .indexOf(GENERATE_COMMAND_QUESTION_MESSAGES.WITH_REDUX) !== -1,
                withHooks: results[GENERATE_QUESTION_NAME.OPTIONS]
                    .indexOf(GENERATE_COMMAND_QUESTION_MESSAGES.WITH_HOOKS) !== -1,
            });
        });
    }
}

export default Wizard;