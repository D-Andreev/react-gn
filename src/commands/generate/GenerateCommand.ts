import path from 'path';
import steed from 'steed';
import ICommand from '../interfaces/ICommand';
import Flag from '../Flag';
import IStorage from '../../services/interfaces/IStorage';
import IUserInterface from '../../user-interface/interfaces/IUserInterface';
import {
    ALLOWED_LANGUAGE_TYPE_FLAGS,
    COMMAND_FLAG,
    FLAGS_WITH_TEMPLATES, GENERATE_COMMAND_QUESTION_MESSAGES,
    GENERATE_COMMAND_QUESTIONS, GENERATE_QUESTION_NAME,
    LANGUAGE_TYPE,
    OUTPUT_TYPE
} from '../../constants';
import Output from '../Output';
import {noop} from '../../utils';
import {sep} from 'path';
import {Answers} from 'inquirer';
import IGenerateAnswers from '../interfaces/IGenerateAnswers';
import ITemplateService from '../../services/interfaces/ITemplateService';
import templates from './templates/templates';
import {IDependency} from '../interfaces/ITemplate';
import ITemplateData from '../interfaces/ITemplateData';
import IPackageManager from '../../services/interfaces/IPackageManager';

export default class GenerateCommand implements ICommand {
    public flags: Flag[];
    public readonly componentName: string;
    public readonly path: string;
    private readonly storage: IStorage;
    private readonly userInterface: IUserInterface;
    public readonly childProcess: typeof import('child_process');
    private templateService: ITemplateService;
    private readonly packageManager: IPackageManager;
    private answers: IGenerateAnswers;

    constructor(
        storage: IStorage,
        userInterface: IUserInterface,
        childProcess: typeof import('child_process'),
        templateService: ITemplateService,
        packageManager: IPackageManager,
        componentName: string,
        flags: Flag[],
        path: string
    ) {
        this.storage = storage;
        this.userInterface = userInterface;
        this.childProcess = childProcess;
        this.templateService = templateService;
        this.packageManager = packageManager;
        this.componentName = componentName;
        this.flags = flags;
        this.path = path;
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
            this.answers = answers;
            done(null);
        });
    }

    private checkTargetDirValidity(done: Function): void {
        const targetPath = path.join(this.answers.targetPath, this.answers.componentName);
        this.storage.directoryExists(targetPath, (err: ErrorEvent) => {
            if (err) {
                return done(null, this.answers);
            }
            done(new Error(`${this.answers.componentName} directory already exists`));
        });
    }

    private static getTemplatesPath(): string[] {
        return [process.cwd(), 'src', 'commands', 'generate', 'templates'];
    }

    private getTemplateFiles(done: Function): void {
        const componentType = this.answers.isClassComponent ? 'container' : 'component';
        const templatePath = path.join(...GenerateCommand.getTemplatesPath(), this.answers.languageType, componentType);
        this.storage.scanDirectory(templatePath, (err: Error, paths: string[]) => {
            if (err) {
                return done(err);
            }

            done(null, paths);
        });
    }

    private getTemplateData(paths: string[], done: Function): void {
        const dataFilePath = path.join(
            process.cwd(), ...GenerateCommand.getTemplatesPath(), 'data.json');
        this.storage.read(dataFilePath, (err: ErrorEvent, file: string) => {
            if (err) {
                return done(err);
            }
            let parsedData;
            try {
                parsedData = JSON.parse(file.toString());
            } catch (e) {
                return done(e);
            }
            done(null, paths, parsedData);
        });
    }

    private installDependencies(paths: string[], parsedData: ITemplateData, done: Function): void {
        const dependencies: IDependency[] = templates.dependencies[this.answers.languageType].map((d: IDependency) => d);
        console.log({dependencies})
        steed.mapSeries(paths, (path: string, next: Function) => {
            console.log(path, next);
        }, (err: ErrorEvent) => done(err));
    }

    execute(done: Function): void {
        steed.waterfall([
            (next: Function) => this.askQuestions(next),
            (next: Function) => this.checkTargetDirValidity(next),
            (answers: IGenerateAnswers, next: Function) => this.getTemplateFiles(next),
            (answers: IGenerateAnswers, paths: string[], next: Function) => this.getTemplateData(paths, next),
            (answers: IGenerateAnswers, paths: string[], data: any, next: Function) => {
                this.packageManager.installDependencies()
            },
            (answers: IGenerateAnswers, paths: string[], data: any, next: Function) => {
                data = {
                    withStyledComponents: !!answers.withStyledComponents,
                    withRedux: !!answers.withRedux,
                    withHooks: !!answers.withHooks,
                    withPropTypes: !!answers.withPropTypes,
                    withState: !!answers.withState,
                    component: answers.componentName,
                    Component: answers.componentName,
                };
                const renderedTemplates: string[] = [];
                steed.mapSeries(paths, (path: string, next: Function) => {
                    this.storage.read(path, (err: ErrorEvent, file: Buffer) => {
                        if (err) {
                            return next(err);
                        }

                        renderedTemplates.push(this.templateService.render(file.toString(), data));
                        next();
                    });
                }, (err: ErrorEvent) => next(err, paths, answers, renderedTemplates));
            },
            (paths: string[], answers: IGenerateAnswers, renderedTemplates: string[], next: Function) => {
                steed.mapSeries(paths, (currentPath: string, next: Function) => {
                    let splitPath: string[] = currentPath.split(sep);
                    const componentType = answers.isClassComponent ? 'container' : 'component';
                    splitPath = splitPath.splice(splitPath.indexOf(componentType));
                    const fileName = splitPath[splitPath.length - 1];
                    this.storage.create(
                        path.join(answers.targetPath, fileName), renderedTemplates[paths.indexOf(currentPath)], next);
                }, (err: ErrorEvent) => next(err));
            }
        ], (err: ErrorEvent) => {
            if (err) {
                return this.onError(err, done);
            }

            done();
        });
    }
}
