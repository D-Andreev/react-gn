import path from 'path';
import steed from 'steed';
import ICommand from '../interfaces/ICommand';
import Flag from '../Flag';
import IStorage from '../../services/interfaces/IStorage';
import IUserInterface from '../../user-interface/interfaces/IUserInterface';
import {
    ALLOWED_LANGUAGE_TYPE_FLAGS,
    COMMAND_FLAG,
    ENUMERABLE_FLAG_ID,
    FLAG_INDICATOR,
    FLAGS_WITH_TEMPLATES, GENERATE_COMMAND_QUESTION_MESSAGES,
    GENERATE_COMMAND_QUESTIONS, GENERATE_QUESTION_NAME,
    LANGUAGE_TYPE,
    NEW_COMPONENT_MESSAGE,
    NON_PLACEHOLDER_FLAGS,
    OUTPUT_TYPE
} from '../../constants';
import Output from '../Output';
import {noop} from '../../utils';
import {sep} from 'path';
import {Answers} from 'inquirer';
import IGenerateAnswers from '../interfaces/IGenerateAnswers';
import ITemplateService from "../../services/interfaces/ITemplateService";
import {IDependency} from "../interfaces/ITemplate";

export default class GenerateCommand implements ICommand {
    public flags: Flag[];
    public readonly componentName: string;
    public readonly path: string;
    private readonly storage: IStorage;
    private readonly userInterface: IUserInterface;
    public readonly childProcess: typeof import('child_process');
    private transformedFilePaths: string[];
    private placeholders: Flag[];
    private targetPath: string;
    private templateName: string;
    private templateService: ITemplateService;

    constructor(
        storage: IStorage,
        userInterface: IUserInterface,
        childProcess: typeof import('child_process'),
        componentName: string,
        flags: Flag[],
        path: string,
        templateService: ITemplateService
    ) {
        this.storage = storage;
        this.userInterface = userInterface;
        this.childProcess = childProcess;
        this.componentName = componentName;
        this.flags = flags;
        this.path = path;
        this.templateService = templateService;
    }

    private onError(err: Error | ErrorEvent, done: Function): void {
        const output: Output[] = [new Output(err.message, OUTPUT_TYPE.ERROR)];
        this.userInterface.showOutput(output, noop);
        return done(err);
    }

    private isInteractiveModeDisabled(): boolean {
        return !!this.flags.find((f: Flag) => f.name === COMMAND_FLAG.INTERACTIVE && f.value === 'false');
    }

    private getFlagValue(flagName: string): string {
        const flag: Flag | undefined = this.flags.find((f: Flag) => f.name === flagName);
        if (!flag) {
            return '';
        }

        return flag.value;
    }

    private askQuestions(done: Function): void {
        if (this.isInteractiveModeDisabled()) {
            return done(null, {
                targetPath: this.getFlagValue(COMMAND_FLAG.COMPONENT_TARGET_PATH),
                componentName: this.getFlagValue(COMMAND_FLAG.COMPONENT_NAME),
                languageType: !!this.getFlagValue(ALLOWED_LANGUAGE_TYPE_FLAGS[1]) ? LANGUAGE_TYPE.TS : LANGUAGE_TYPE.JS,
                isClassComponent: !!this.getFlagValue(COMMAND_FLAG.IS_CLASS_COMPONENT),
                withPropTypes: !!this.getFlagValue(COMMAND_FLAG.WITH_PROP_TYPES),
                withStyledComponents: !!this.getFlagValue(COMMAND_FLAG.WITH_STYLED_COMPONENTS),
                withState: !!this.getFlagValue(COMMAND_FLAG.WITH_STATE),
                withRedux: !!this.getFlagValue(FLAGS_WITH_TEMPLATES.WITH_REDUX),
                withHooks: !!this.getFlagValue(COMMAND_FLAG.WITH_HOOKS),
            });
        }

        this.userInterface.prompt(GENERATE_COMMAND_QUESTIONS, (err: ErrorEvent, results: Answers) => {
            if (err) {
                return done(err);
            }

            const answers: IGenerateAnswers = {
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
            };
            done(null, answers);
        });
    }

    execute(done: Function): void {
        steed.waterfall([
            (next: Function) => this.askQuestions(next),
            (answers: IGenerateAnswers, next: Function) => {
                const targetPath = path.join(answers.targetPath, answers.componentName);
                this.storage.directoryExists(targetPath, (err: ErrorEvent) => {
                    if (err) {
                        return next(null, answers);
                    }
                    console.log('component dir checked', err)
                    next(new Error(`${answers.componentName} directory already exists`));
                })
            },
            (answers: IGenerateAnswers, next: Function) => {
                console.log('answers', answers);
                const componentType = answers.isClassComponent ? 'container' : 'component';
                const templatePath = path.join(
                    process.cwd(), 'src', 'commands', 'generate', 'templates', answers.languageType, componentType);
                console.log('template path', templatePath);
                this.storage.scanDirectory(templatePath, (err: Error, paths: string[]) => {
                    console.log('dir scanned', {err});
                    if (err) {
                        return next(err);
                    }

                    next(null, answers, paths);
                });
            },
            (answers: IGenerateAnswers, paths: string[], next: Function) => {
                const dataFilePath = path.join(
                    process.cwd(), 'src', 'commands', 'generate', 'templates', 'data.json');
                console.log('data', dataFilePath)
                this.storage.read(dataFilePath, (err: ErrorEvent, file: string) => {
                    if (err) {
                        return next(err);
                    }
                    console.log(file.toString())
                    next(null, answers, paths, JSON.parse(file.toString()));
                })
            },
            (answers: IGenerateAnswers, paths: string[], data: any, next: Function) => {
                console.log({answers, paths, data});
                data.withStyledComponents = answers.withStyledComponents;
                data.withRedux = answers.withRedux;
                data.component = answers.componentName;
                data.Component = answers.componentName;
                data.withHooks = answers.withHooks;
                data.withPropTypes = answers.withPropTypes;
                data.withState = answers.withState;
                const renderedTemplates: string[] = [];
                steed.mapSeries(paths, (path: string, next: Function) => {
                    this.storage.read(path, (err: ErrorEvent, file: Buffer) => {
                        if (err) {
                            return next(err);
                        }

                        renderedTemplates.push(this.templateService.render(file.toString(), data));
                        next();
                    });
                }, (err: ErrorEvent) => next(err, paths, renderedTemplates));
            },
            (paths: string[], renderedTemplates: string[], next: Function) => {
                console.log({renderedTemplates});
                steed.mapSeries(paths, (path: string, next: Function) => {
                    this.storage.create(path, renderedTemplates[paths.indexOf(path)], next);
                }, (err: ErrorEvent) => next(err))
                next();
            }
        ], (err: ErrorEvent) => {
            if (err) {
                return this.onError(err, done);
            }

            done();
        });
    }
}
