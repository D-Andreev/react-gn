import path from 'path';
import steed from 'steed';
import ICommand from '../interfaces/ICommand';
import Flag from '../../lib/Flag';
import IStorage from '../../services/interfaces/IStorage';
import IUserInterface from '../../services/interfaces/IUserInterface';
import {
    ALLOWED_LANGUAGE_TYPE_FLAGS,
    COMMAND_FLAG, COMPONENT_NAME_PLACEHOLDER, COMPONENT_TYPE,
    FLAGS_WITH_TEMPLATES,
    LANGUAGE_TYPE,
} from '../../constants';
import IGenerateAnswers from '../interfaces/IGenerateAnswers';
import ITemplateService from '../../services/interfaces/ITemplateService';
import templateDefinition from './templates/templateDefinition';
import IRenderedTemplate from '../interfaces/IRenderedTemplate';
import IPrettier from '../../services/interfaces/IPrettier';
import ITemplateFile from '../interfaces/ITemplateFile';
import IWizard from '../../services/interfaces/IWizard';
import BaseGenerateCommand from '../BaseGenerateCommand';

export default class GenerateCommand extends BaseGenerateCommand implements ICommand {
    public readonly storage: IStorage;
    public readonly userInterface: IUserInterface;
    private readonly childProcess: typeof import('child_process');
    private readonly templateService: ITemplateService;
    public readonly prettier: IPrettier;
    private readonly wizard: IWizard;
    public flags: Flag[];
    private answers: IGenerateAnswers;
    private parsedData: any;
    private templatePaths: string[];
    private templateFiles: ITemplateFile[];
    public renderedTemplates: IRenderedTemplate[];

    constructor(
        storage: IStorage,
        userInterface: IUserInterface,
        childProcess: typeof import('child_process'),
        templateService: ITemplateService,
        prettier: IPrettier,
        wizard: IWizard,
        flags: Flag[]
    ) {
        super(userInterface, prettier, storage, flags);
        this.storage = storage;
        this.userInterface = userInterface;
        this.childProcess = childProcess;
        this.templateService = templateService;
        this.prettier = prettier;
        this.wizard = wizard;
        this.flags = flags;
    }

    protected extractFileNameFromPath(path: string): string {
        return super.extractFileNameFromPath(path);
    }

    protected onError(err: Error | Error, done: Function): void {
        return super.onError(err, done);
    }

    protected isInteractiveModeDisabled(): boolean {
        return super.isInteractiveModeDisabled();
    }

    private isFlagPassed(flagName: string): boolean {
        return !!this.flags.find((f: Flag) => f.name === flagName);
    }

    public getFlagValue(flagName: string): string {
        return super.getFlagValue(flagName);
    }

    private setTemplateData(): void {
        this.parsedData = {
            withCss: !!this.answers.withCss,
            withSass: !!this.answers.withSass,
            withLess: !!this.answers.withLess,
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
                withCss: this.isFlagPassed(COMMAND_FLAG.WITH_CSS),
                withSass: this.isFlagPassed(COMMAND_FLAG.WITH_SASS),
                withLess: this.isFlagPassed(COMMAND_FLAG.WITH_LESS),
                withStyledComponents: this.isFlagPassed(COMMAND_FLAG.WITH_STYLED_COMPONENTS),
                withState: this.isFlagPassed(COMMAND_FLAG.WITH_STYLED_COMPONENTS),
                withRedux: this.isFlagPassed(FLAGS_WITH_TEMPLATES.WITH_REDUX),
                withHooks: this.isFlagPassed(COMMAND_FLAG.WITH_HOOKS),
            };
            return done();
        }
        this.wizard.askGenerateCommandQuestions((err: Error, answers: IGenerateAnswers) => {
            if (err) {
                return done(err);
            }

            this.answers = answers;
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
            return this.templateFiles.find(f =>
                this.extractFileNameFromPath(f.path) === fileName);
        });
    }

    private generateFilePath(templateFile: ITemplateFile): string {
        const fileName = templateFile.path.split('.').slice(0, -1).join('.');
        return path
            .join(this.answers.targetPath, this.answers.componentName, `${fileName}`)
            .replace(COMPONENT_NAME_PLACEHOLDER, this.answers.componentName);
    }

    private renderTemplates(done: Function): void {
        this.setTemplateData();
        this.setTemplateFiles();
        this.setTemplatePaths();
        const renderedTemplates: IRenderedTemplate[] = [];

        steed.mapSeries(this.templatePaths, (templateFilePath: string, next: Function) => {
            this.storage.read(templateFilePath, (err: Error, file: Buffer) => {
                if (err) {
                    return next(err);
                }
                const templateFileName: string = this.extractFileNameFromPath(templateFilePath);
                const templateFile: ITemplateFile =
                    this.templateFiles.find(f => {
                        return this.extractFileNameFromPath(f.path) === templateFileName;
                    });
                if (!templateFile) {
                    return next(new Error(`${templateFileName} was not found!`))
                }

                renderedTemplates.push({
                    path: this.generateFilePath(templateFile),
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

    protected prettifyCode(done: Function): void {
        super.prettifyCode(done);
    }

    public showResults(): void {
        super.showResults(this.answers.componentName);
    }

    execute(done: Function): void {
        steed.waterfall([
            (next: Function) => this.askQuestions(next),
            (next: Function) => this.checkIfDirectoryAlreadyExists(next),
            (next: Function) => this.getTemplateFiles(next),
            (next: Function) => this.getTemplateData(next),
            (next: Function) => this.renderTemplates(next),
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
            this.showResults();
            done();
        });
    }
}
