import path from 'path';
import steed from 'steed';
import ICommand from '../interfaces/ICommand';
import Flag from '../Flag';
import IStorage from '../../services/interfaces/IStorage';
import IUserInterface from '../../services/interfaces/IUserInterface';
import {
    ALLOWED_LANGUAGE_TYPE_FLAGS,
    COMMAND_FLAG, COMPONENT_NAME_PLACEHOLDER, COMPONENT_TYPE,
    FLAGS_WITH_TEMPLATES, GENERATE_COMMAND_QUESTION_MESSAGES,
    GENERATE_COMMAND_QUESTIONS, GENERATE_QUESTION_NAME,
    LANGUAGE_TYPE,
    OUTPUT_TYPE, PRETTIFIABLE_EXTENSIONS
} from '../../constants';
import Output from '../Output';
import {noop} from '../../utils';
import {sep} from 'path';
import {Answers} from 'inquirer';
import IGenerateAnswers from '../interfaces/IGenerateAnswers';
import ITemplateService from '../../services/interfaces/ITemplateService';
import templateDefinition from './templates/templateDefinition';
import IPackageManager from '../../services/interfaces/IPackageManager';
import IRenderedTemplate from '../interfaces/IRenderedTemplate';
import ITemplateFile from '../interfaces/ITemplateFile';
import IPrettier from '../../services/interfaces/IPrettier';

export default class GenerateCommand implements ICommand {
    private readonly componentName: string;
    private readonly path: string;
    private readonly storage: IStorage;
    private readonly userInterface: IUserInterface;
    private readonly childProcess: typeof import('child_process');
    private readonly templateService: ITemplateService;
    private readonly packageManager: IPackageManager;
    private readonly prettier: IPrettier;
    public flags: Flag[];
    private answers: IGenerateAnswers;
    private projectMainDir: string;
    private parsedData: any;
    private templatePaths: string[];
    private templateFiles: ITemplateFile[];
    private renderedTemplates: IRenderedTemplate[];

    constructor(
        storage: IStorage,
        userInterface: IUserInterface,
        childProcess: typeof import('child_process'),
        templateService: ITemplateService,
        packageManager: IPackageManager,
        prettier: IPrettier,
        componentName: string,
        flags: Flag[],
        path: string
    ) {
        this.storage = storage;
        this.userInterface = userInterface;
        this.childProcess = childProcess;
        this.templateService = templateService;
        this.packageManager = packageManager;
        this.prettier = prettier;
        this.componentName = componentName;
        this.flags = flags;
        this.path = path;
    }

    private static extractFileNameFromPath(path: string): string {
        const splitPath: string[] = path.split('/');
        return splitPath[splitPath.length - 1];
    }

    private onError(err: Error | Error, done: Function): void {
        const output: Output[] = [new Output(err.message, OUTPUT_TYPE.ERROR)];
        this.userInterface.showOutput(output, noop);
        return done(err);
    }

    private isInteractiveModeDisabled(): boolean {
        return !!this.flags.find((f: Flag) => f.name === COMMAND_FLAG.INTERACTIVE && f.value === 'false');
    }

    private isFlagPassed(flagName: string): boolean {
        return !!this.flags.find((f: Flag) => f.name === flagName);
    }

    private getFlagValue(flagName: string): string {
        const flag: Flag | undefined = this.flags.find((f: Flag) => f.name === flagName);
        if (!flag) {
            return '';
        }

        return flag.value;
    }

    private setTemplateData(): void {
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
                isClassComponent: this.isFlagPassed(COMMAND_FLAG.IS_CLASS_COMPONENT),
                withPropTypes: this.isFlagPassed(COMMAND_FLAG.WITH_PROP_TYPES),
                withStyledComponents: this.isFlagPassed(COMMAND_FLAG.WITH_STYLED_COMPONENTS),
                withState: this.isFlagPassed(COMMAND_FLAG.WITH_STYLED_COMPONENTS),
                withRedux: this.isFlagPassed(FLAGS_WITH_TEMPLATES.WITH_REDUX),
                withHooks: this.isFlagPassed(COMMAND_FLAG.WITH_HOOKS),
            };
            return done();
        }

        this.userInterface.prompt(GENERATE_COMMAND_QUESTIONS, (err: Error, results: Answers) => {
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

    private checkIfDirectoryAlreadyExists(done: Function): void {
        const targetPath = path.join(this.answers.targetPath, this.answers.componentName);
        this.storage.directoryExists(targetPath, (err: Error) => {
            if (err) {
                return done();
            }
            done(new Error(`${this.answers.componentName} directory already exists`));
        });
    }

    private getComponentType(): string {
        return this.answers.isClassComponent ? COMPONENT_TYPE.CONTAINER : COMPONENT_TYPE.COMPONENT;
    }

    private getTemplateFiles(done: Function): void {
        const componentType = this.getComponentType();
        const templatePath = path.join(__dirname, 'templates', this.answers.languageType, componentType);
        this.storage.scanDirectory(templatePath, (err: Error, paths: string[]) => {
            if (err) {
                return done(err);
            }
            this.templatePaths = paths;
            done();
        });
    }

    private getTemplateData(done: Function): void {
        const dataFilePath = path.join(__dirname, 'templates', 'data', 'data.json');
        this.storage.read(dataFilePath, (err: Error, file: string) => {
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
        this.storage.read(currentPath, (err: Error) => {
            if (err) {
                splitPath.pop();
                return this.getProjectMainDir(splitPath, done);
            }
            this.projectMainDir = path.join(...splitPath);
            done();
        });
    }

    private setTemplateFiles(): void {
        const componentType = this.getComponentType();
        const templateConfig = templateDefinition[this.answers.languageType][componentType];
        let templateFiles = templateConfig.main;
        Object.keys(this.answers).forEach((answerKey: string) => {
            if (templateConfig.hasOwnProperty(answerKey) && this.parsedData[answerKey]) {
                const options = templateConfig[answerKey];
                templateFiles = templateFiles.concat(options);
            }
        });
        this.templateFiles = templateFiles;
    }

    private setTemplatePaths(): void {
        this.templatePaths = this.templatePaths.filter((templatePath: string) => {
            const splitPath: string[] = templatePath.split('/');
            const fileName: string = splitPath[splitPath.length - 1];
            return this.templateFiles.find(f => GenerateCommand.extractFileNameFromPath(f.path) === fileName);
        });
    }

    private renderTemplates(done: Function): void {
        const renderedTemplates: IRenderedTemplate[] = [];
        steed.mapSeries(this.templatePaths, (templateFilePath: string, next: Function) => {
            this.storage.read(templateFilePath, (err: Error, file: Buffer) => {
                if (err) {
                    return next(err);
                }
                const templateFileName: string = GenerateCommand.extractFileNameFromPath(templateFilePath);
                const templateFile: ITemplateFile =
                    this.templateFiles.find(f => {
                        return GenerateCommand.extractFileNameFromPath(f.path) === templateFileName;
                    });
                if (!templateFile) {
                    return next(new Error(`${templateFileName} was not found!`))
                }
                const fileName = templateFile.path.split('.').slice(0, -1).join('.');
                const filePath = path.join(
                    this.answers.targetPath, this.answers.componentName, `${fileName}.${templateFile.extension}`);
                renderedTemplates.push({
                    path: filePath.replace(COMPONENT_NAME_PLACEHOLDER, this.answers.componentName),
                    content: this.templateService.render(file.toString(), this.parsedData)
                });
                next();
            });
        }, (err: Error) => {
            if (err) {
                return done(err);
            }
            this.renderedTemplates = renderedTemplates;
            done();
        });
    }

    private prettifyCode(done: Function): void {
        const filesThatCanBePrettified: IRenderedTemplate[] = this.renderedTemplates
            .filter((renderedTemplate: IRenderedTemplate) => {
                let isPrettifiable = false;

                for (let i = 0; i < PRETTIFIABLE_EXTENSIONS.length; i++) {
                    const currentExtension = PRETTIFIABLE_EXTENSIONS[i];
                    const lastChars: string = renderedTemplate
                        .path
                        .substr(renderedTemplate.path.length - currentExtension.length);
                    if (lastChars === currentExtension) {
                        isPrettifiable = true;
                        break;
                    }
                }

                return isPrettifiable;
            });
        steed.mapSeries(filesThatCanBePrettified, (template: IRenderedTemplate, next: Function) => {
            this.prettier.prettify(template.content, (err: Error, formattedCode: string) => {
                if (err) {
                    return next(err);
                }

                const index: number = this.renderedTemplates.findIndex(f => f.path === template.path);
                if (index === -1) {
                    return next(`Could not format ${template.path}`);
                }

                this.renderedTemplates[index].content = formattedCode;
                next();
            });
        }, (err: Error) => done(err));
    }

    execute(done: Function): void {
        steed.waterfall([
            (next: Function) => this.askQuestions(next),
            (next: Function) => this.checkIfDirectoryAlreadyExists(next),
            (next: Function) => this.getTemplateFiles(next),
            (next: Function) => this.getTemplateData(next),
            (next: Function) => {
                const splitPath: string[] = path.join(process.cwd(), this.answers.targetPath).split('/');
                this.getProjectMainDir(splitPath, next);
            },
            (next: Function) => {
                this.setTemplateData();
                this.setTemplateFiles();
                this.setTemplatePaths();
                this.renderTemplates(next);
            },
            (next: Function) => this.prettifyCode(next),
            (next: Function) =>
                this.storage.createDirectory(path.join(this.answers.targetPath, this.answers.componentName), next),
            (next: Function) => {
                const paths: string[] = this.renderedTemplates.map((template: IRenderedTemplate) => template.path);
                this.storage.createPaths(process.cwd(), paths, next);
            },
            (next: Function) =>
                steed.mapSeries(this.renderedTemplates, (template: IRenderedTemplate, next: Function) => {
                    this.storage.create(template.path, template.content, next);
                }, (err: Error) => next(err)),
        ], (err: Error) => {
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
