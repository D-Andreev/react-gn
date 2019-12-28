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
import {COMMAND_FLAG, COMPONENT_NAME_PLACEHOLDER, OUTPUT_TYPE, PRETTIFIABLE_EXTENSIONS} from '../../constants';
import {noop} from '../../utils';

export default class TemplateCommand implements ICommand {
    private readonly storage: IStorage;
    private readonly userInterface: IUserInterface;
    private readonly childProcess: typeof import('child_process');
    private readonly templateService: ITemplateService;
    private readonly prettier: IPrettier;
    private readonly wizard: IWizard;
    public flags: Flag[];
    private answers: ITemplateAnswers;
    private parsedData: any;
    private templatePaths: string[];
    private renderedTemplates: IRenderedTemplate[];

    private static extractFileNameFromPath(path: string): string {
        const splitPath: string[] = path.split('/');
        return splitPath[splitPath.length - 1];
    }

    constructor(
        storage: IStorage,
        userInterface: IUserInterface,
        childProcess: typeof import('child_process'),
        templateService: ITemplateService,
        prettier: IPrettier,
        wizard: IWizard,
        flags: Flag[]
    ) {
        this.storage = storage;
        this.userInterface = userInterface;
        this.childProcess = childProcess;
        this.templateService = templateService;
        this.prettier = prettier;
        this.wizard = wizard;
        this.flags = flags;
    }

    private onError(err: Error | Error, done: Function): void {
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
            this.answers = {
                templatePath: this.getFlagValue(COMMAND_FLAG.TEMPLATE_PATH),
                targetDir: this.getFlagValue(COMMAND_FLAG.COMPONENT_TARGET_PATH),
                componentName: this.getFlagValue(COMMAND_FLAG.COMPONENT_NAME)
            };
            return done();
        }
        this.wizard.askTemplateCommandQuestions((err: Error, answers: ITemplateAnswers) => {
            if (err) {
                return done(err);
            }

            this.answers = answers;
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

    private getTemplateData(done: Function): void {
        const dataFilePath = path.join(this.answers.templatePath, 'data.json');
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
            this.parsedData.component = this.answers.componentName;
            done();
        });
    }

    private generateFilePath(templateFile: string): string {
        const fileName = templateFile.split('.').slice(0, -1).join('.');
        return path.join(this.answers.targetDir, this.answers.componentName, `${fileName}`)
            .replace(COMPONENT_NAME_PLACEHOLDER, this.answers.componentName);
    }

    private renderTemplates(done: Function): void {
        const renderedTemplates: IRenderedTemplate[] = [];
        steed.mapSeries(this.templatePaths, (templateFilePath: string, next: Function) => {
            this.storage.read(templateFilePath, (err: Error, file: Buffer) => {
                if (err) {
                    return next(err);
                }
                const templateFileName: string = TemplateCommand.extractFileNameFromPath(templateFilePath);
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

    private checkIfDirectoryAlreadyExists(done: Function): void {
        const targetPath = path.join(this.answers.targetDir, this.answers.componentName);
        this.storage.directoryExists(targetPath, (err: Error) => {
            if (err) {
                return done();
            }
            done(new Error(`${this.answers.componentName} directory already exists`));
        });
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
                this.storage.createDirectory(path.join(this.answers.targetDir, this.answers.componentName), next),
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
            const message = 'Template was rendered successfully!';
            const output: Output[] = [new Output(message, OUTPUT_TYPE.SUCCESS)];
            this.userInterface.showOutput(output, noop);
            this.renderedTemplates.forEach((renderedTemplate: IRenderedTemplate) => {
                const message = `  - ${renderedTemplate.path}`;
                const output: Output[] = [new Output(message, OUTPUT_TYPE.SUCCESS)];
                this.userInterface.showOutput(output, noop);
            });
            done();
        });
    }
}
