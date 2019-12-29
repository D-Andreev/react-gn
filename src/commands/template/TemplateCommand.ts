import path from 'path';
import steed from 'steed';
import ICommand from '../interfaces/ICommand';
import Flag from '../../lib/Flag';
import IStorage from '../../services/interfaces/IStorage';
import IUserInterface from '../../services/interfaces/IUserInterface';
import ITemplateService from '../../services/interfaces/ITemplateService';
import IPrettier from '../../services/interfaces/IPrettier';
import ITemplateAnswers from '../interfaces/ITemplateAnswers';
import IWizard from '../../services/interfaces/IWizard';
import IRenderedTemplate from '../interfaces/IRenderedTemplate';
import Output from '../../lib/Output';
import {COMMAND_FLAG, COMPONENT_NAME_PLACEHOLDER, OUTPUT_TYPE} from '../../constants';
import {noop} from '../../utils';
import BaseGenerateCommand from '../BaseGenerateCommand';

export default class TemplateCommand extends BaseGenerateCommand implements ICommand {
    public storage: IStorage;
    public userInterface: IUserInterface;
    private readonly childProcess: typeof import('child_process');
    private readonly templateService: ITemplateService;
    public prettier: IPrettier;
    private readonly wizard: IWizard;
    public flags: Flag[];
    private answers: ITemplateAnswers;
    private parsedData: any;
    private templatePaths: string[];
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

    public getFlagValue(flagName: string): string {
        return super.getFlagValue(flagName);
    }

    private askQuestions(done: Function): void {
        if (this.isInteractiveModeDisabled()) {
            this.answers = {
                templatePath: this.getFlagValue(COMMAND_FLAG.TEMPLATE_PATH),
                targetPath: this.getFlagValue(COMMAND_FLAG.COMPONENT_TARGET_PATH),
                componentName: this.getFlagValue(COMMAND_FLAG.COMPONENT_NAME)
            };
            return done();
        }
        this.wizard.askTemplateCommandQuestions((err: Error, answers: ITemplateAnswers) => {
            if (err) {
                return done(err);
            }

            this.answers = answers;
            this.answers.targetPath = path.relative(process.cwd(), answers.targetPath);
            this.answers.templatePath = path.relative(process.cwd(), answers.templatePath);
            done();
        });
    }

    private isTemplateFile(fileName: string): boolean {
        const fileExtension: string = fileName.split('.').pop();
        return fileExtension === 'ejs';
    }

    private getTemplateFiles(done: Function): void {
        this.storage.scanDirectory(this.answers.templatePath, (err: Error, paths: string[]) => {
            if (err) {
                return done(err);
            }
            this.templatePaths = paths.filter((path: string) => this.isTemplateFile(path));
            done();
        });
    }

    private setParsedData(data = {}): void {
        this.parsedData = data;
        this.parsedData.component = this.answers.componentName;
    }

    private getTemplateData(done: Function): void {
        const dataFilePath = path.join(this.answers.templatePath, 'data.json');
        this.storage.read(dataFilePath, (err: Error, file: string) => {
            if (err) {
                const message = `${dataFilePath} was not found. No data will be passed to templates.`;
                const output: Output[] = [new Output(message, OUTPUT_TYPE.WARN)];
                this.userInterface.showOutput(output, noop);
                this.setParsedData();
                return done();
            }
            try {
                const parsedData = JSON.parse(file.toString());
                this.setParsedData(parsedData);
                done();
            } catch (e) {
                this.setParsedData();
                return done(e);
            }
        });
    }

    private generateFilePath(templateFile: string): string {
        const fileName = templateFile.split('.').slice(0, -1).join('.');
        return path.join(this.answers.targetPath, this.answers.componentName, `${fileName}`)
            .replace(COMPONENT_NAME_PLACEHOLDER, this.answers.componentName);
    }

    private renderTemplates(done: Function): void {
        const renderedTemplates: IRenderedTemplate[] = [];
        steed.mapSeries(this.templatePaths, (templateFilePath: string, next: Function) => {
            this.storage.read(templateFilePath, (err: Error, file: Buffer) => {
                if (err) {
                    return next(err);
                }
                const templateFileName: string = this.extractFileNameFromPath(templateFilePath);
                renderedTemplates.push({
                    path: this.generateFilePath(templateFileName),
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

    private checkIfDirectoryAlreadyExists(done: Function): void {
        const targetPath = path.join(this.answers.targetPath, this.answers.componentName);
        this.storage.directoryExists(targetPath, (err: Error) => {
            if (err) {
                return done();
            }
            done(new Error(`${this.answers.componentName} directory already exists`));
        });
    }

    public showResults(): void {
        super.showResults(this.answers.componentName);
    }

    public showLogo() {
        super.showLogo();
    }

    execute(done: Function): void {
        this.showLogo();
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
            (next: Function) => {
                steed.mapSeries(this.renderedTemplates, (template: IRenderedTemplate, next: Function) => {
                    this.storage.create(template.path, template.content, next);
                }, (err: Error) => next(err))
            },
        ], (err: Error) => {
            if (err) {
                return this.onError(err, done);
            }
            this.showResults();
            done();
        });
    }
}
