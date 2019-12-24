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
import IPackageManager from '../../services/interfaces/IPackageManager';
import IRenderedTemplate from '../interfaces/IRenderedTemplate';
import ITemplateFile from '../interfaces/ITemplateFile';

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
    private projectMainDir: string;
    private parsedData: any;
    private templatePaths: string[];

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

    private setParsedData(): void {
        this.parsedData = {
            withStyledComponents: !!this.answers.withStyledComponents,
            withRedux: !!this.answers.withRedux,
            withHooks: !!this.answers.withHooks,
            withPropTypes: !!this.answers.withPropTypes,
            withState: !!this.answers.withState,
            component: this.answers.componentName,
            Component: this.answers.componentName,
        };
    }

    private askQuestions(done: Function): void {
        if (this.isInteractiveModeDisabled()) {
            this.answers = {
                targetPath: this.getFlagValue(COMMAND_FLAG.COMPONENT_TARGET_PATH),
                componentName: this.getFlagValue(COMMAND_FLAG.COMPONENT_NAME),
                languageType: !!this.getFlagValue(ALLOWED_LANGUAGE_TYPE_FLAGS[1]) ? LANGUAGE_TYPE.TS : LANGUAGE_TYPE.JS,
                isClassComponent: !!this.getFlagValue(COMMAND_FLAG.IS_CLASS_COMPONENT),
                withPropTypes: !!this.getFlagValue(COMMAND_FLAG.WITH_PROP_TYPES),
                withStyledComponents: !!this.getFlagValue(COMMAND_FLAG.WITH_STYLED_COMPONENTS),
                withState: !!this.getFlagValue(COMMAND_FLAG.WITH_STATE),
                withRedux: !!this.getFlagValue(FLAGS_WITH_TEMPLATES.WITH_REDUX),
                withHooks: !!this.getFlagValue(COMMAND_FLAG.WITH_HOOKS),
            };
            return done();
        }

        this.userInterface.prompt(GENERATE_COMMAND_QUESTIONS, (err: ErrorEvent, results: Answers) => {
            if (err) {
                return done(err);
            }

            this.answers = {
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
            done();
        });
    }

    private checkTargetDirValidity(done: Function): void {
        const targetPath = path.join(this.answers.targetPath, this.answers.componentName);
        this.storage.directoryExists(targetPath, (err: ErrorEvent) => {
            if (err) {
                return done();
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
            this.templatePaths = paths;
            done();
        });
    }

    private getTemplateData(done: Function): void {
        const dataFilePath = path.join(...GenerateCommand.getTemplatesPath(), 'data.json');
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
            this.parsedData = parsedData;
            done();
        });
    }

    private getProjectMainDir(splitPath: string[], done: Function): void {
        if (!splitPath.length) {
            return done(new Error('Could not find project main directory'));
        }

        const currentPath: string = path.join(sep, ...splitPath, 'package.json');
        this.storage.read(currentPath, (err: ErrorEvent) => {
            if (err) {
                splitPath.pop();
                return this.getProjectMainDir(splitPath, done);
            }
            this.projectMainDir = path.join(...splitPath);
            done();
        });
    }

    private getFilesForTemplate(): ITemplateFile[] {
        const componentType = this.answers.isClassComponent ? 'container' : 'component';
        const templateConfig = templates[this.answers.languageType][componentType];
        let shouldInstallFiles = templateConfig.main;
        Object.keys(this.answers).forEach((answerKey: string) => {
            if (templateConfig.hasOwnProperty(answerKey) && this.parsedData[answerKey]) {
                const options = templateConfig[answerKey].map((t: IRenderedTemplate) => t.path);
                shouldInstallFiles = shouldInstallFiles.concat(options);
            }
        });

        return shouldInstallFiles;
    }

    private setTemplateFiles(files: ITemplateFile[]): void {
        this.templatePaths = this.templatePaths.filter((p: string) => {
            const splitPath: string[] = p.split('/');
            const fileName: string = splitPath[splitPath.length - 1];
            return files.find(f => f.path === fileName);
        });
    }

    private renderTemplates(files: ITemplateFile[], done: Function): void {
        const renderedTemplates: IRenderedTemplate[] = [];
        steed.mapSeries(this.templatePaths, (templateFilePath: string, next: Function) => {
            this.storage.read(templateFilePath, (err: ErrorEvent, file: Buffer) => {
                if (err) {
                    return next(err);
                }
                const splitFilePath: string[] = templateFilePath.split('/');
                const templateFile: ITemplateFile =
                    files.find(f => f.path === splitFilePath[splitFilePath.length - 1]);
                const fileName = templateFile.path.split('.').slice(0, -1).join('.');
                const filePath = path.join(
                    this.answers.targetPath, this.answers.componentName, `${fileName}.${templateFile.extension}`);
                renderedTemplates.push({
                    path: filePath,
                    content: this.templateService.render(file.toString(), this.parsedData)
                });
                next();
            });
        }, (err: ErrorEvent) => done(err, renderedTemplates, files));
    }

    execute(done: Function): void {
        steed.waterfall([
            (next: Function) => this.askQuestions(next),
            (next: Function) => this.checkTargetDirValidity(next),
            (next: Function) => this.getTemplateFiles(next),
            (next: Function) => this.getTemplateData(next),
            (next: Function) => {
                const splitPath: string[] = path.join(process.cwd(), this.answers.targetPath).split('/');
                this.getProjectMainDir(splitPath, next);
            },
            (next: Function) => {
                const dependencies: IDependency[] = templates.dependencies[this.answers.languageType];
                this.packageManager.installDependencies(dependencies, this.projectMainDir, next);
            },
            (next: Function) => {
                this.setParsedData();
                const files: ITemplateFile[] = this.getFilesForTemplate();
                this.setTemplateFiles(files);
                this.renderTemplates(files, next);
            },
            (renderedTemplates: IRenderedTemplate[], files: ITemplateFile[], next: Function) => {
                const dirPath = path.join(this.answers.targetPath, this.answers.componentName);
                this.storage.createDirectory(dirPath, (err: ErrorEvent) => {
                    if (err) {
                        return next(err);
                    }

                    next(null, renderedTemplates, files);
                })
            },
            (renderedTemplates: IRenderedTemplate[], files: ITemplateFile[], next: Function) => {
                steed.mapSeries(renderedTemplates, (template: IRenderedTemplate, next: Function) => {
                    this.storage.create(template.path, template.content, next);
                }, (err: ErrorEvent) => next(err));
            }
        ], (err: ErrorEvent) => {
            if (err) {
                return this.onError(err, done);
            }
            const message = `${this.answers.componentName} was created successfully!`;
            const output: Output[] = [new Output(message, OUTPUT_TYPE.SUCCESS)];
            this.userInterface.showOutput(output, noop);
            done();
        });
    }
}
