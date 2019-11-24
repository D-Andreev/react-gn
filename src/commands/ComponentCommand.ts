import ICommand from './interfaces/ICommand';
import Flag from './Flag';
import IStorage from '../services/interfaces/IStorage';
import IUserInterface from '../user-interface/interfaces/IUserInterface';
import {
    COMMAND_FLAG,
    ENUMERABLE_FLAGS,
    FLAG_INDICATOR,
    NEW_COMPONENT_MESSAGE,
    NON_PLACEHOLDER_FLAGS,
    OUTPUT_TYPE
} from '../constants';
import Output from './Output';
import {noop} from '../utils';
import {sep} from 'path';

export default class ComponentCommand implements ICommand {
    public readonly flags: Flag[];
    public readonly componentName: string;
    public readonly path: string;
    private readonly storage: IStorage;
    private readonly userInterface: IUserInterface;
    public readonly childProcess: typeof import('child_process');
    private transformedFilePaths: string[];
    private placeholders: Flag[];
    private targetPath: string;
    private templateName: string;

    constructor(
        storage: IStorage,
        userInterface: IUserInterface,
        childProcess: typeof import('child_process'),
        componentName: string,
        flags: Flag[],
        path: string
    ) {
        this.storage = storage;
        this.userInterface = userInterface;
        this.childProcess = childProcess;
        this.componentName = componentName;
        this.flags = flags;
        this.path = path;
    }

    private static replacePlaceholdersWithData(input: string, placeholders: Flag[]): string {
        for (let i = 0; i < placeholders.length; i++) {
            const placeholder = new RegExp(
                `{${placeholders[i].name.replace(FLAG_INDICATOR, '')}}`,
                'gi'
            );
            input = input.replace(placeholder, placeholders[i].value);
        }

        return input;
    }

    private static getTemplateParts(templatePath: string): string[] {
        if (templatePath.indexOf('/') !== -1) {
            return templatePath.split('/');
        } else if (templatePath.indexOf('\\') !== -1) {
            return templatePath.split('\\');
        } else {
            return [];
        }
    }

    private extractPlaceholdersFromFlags(): Flag[] {
        const placeholders: Flag[] = [];
        for (let i = 0; i < this.flags.length; i++) {
            const flag: Flag = this.flags[i];
            if (NON_PLACEHOLDER_FLAGS.indexOf(flag.name) !== -1) {
                continue;
            }
            if (ENUMERABLE_FLAGS.indexOf(flag.name) !== -1) {
                const split: string[] = flag.value.split(',');
                for (let j = 0; j < split.length; j++) {
                    placeholders.push({name: `${flag.name}${j + 1}`, value: split[j]});
                }
                continue;
            }

            placeholders.push(flag);
        }
        return placeholders;
    }

    private onError(err: Error | ErrorEvent, done: Function): void {
        const output: Output[] = [new Output(err.message, OUTPUT_TYPE.ERROR)];
        this.userInterface.showOutput(output, noop);
        return done(err);
    }

    private getFlag(flagName: string): Flag | undefined {
        return this.flags.find((f: Flag) => f.name === flagName);
    }

    private transformFilePaths(filePaths: string[], componentName: string): string[] {
        return filePaths.map((filePath: string) => {
            const matchComponentPath: any = filePath.match(/container(.*)/gi);
            const componentPath = matchComponentPath[0].replace(`${this.templateName}${sep}`, '');
            let generatedPath = `${this.targetPath}${sep}${componentName}${sep}${componentPath}`;
            generatedPath = ComponentCommand.replacePlaceholdersWithData(generatedPath, this.placeholders);
            let componentParts = generatedPath.split(sep);
            const indexOfMainPath = componentParts.indexOf(componentName);
            componentParts = componentParts.slice(indexOfMainPath);
            return componentParts.join(sep);
        });
    }

    private renderTemplate(templatePath: string, transformedFilePath: string, i: number, done: Function): void {
        const renderedTemplatePath = ComponentCommand
            .replacePlaceholdersWithData(transformedFilePath, this.placeholders);
        const parts: string[] = renderedTemplatePath.split(sep);
        if (!parts || !parts.length) {
            return done(new Error(NEW_COMPONENT_MESSAGE.INVALID_NAME));
        }
        this.storage.generateFilePath(
            [this.targetPath, renderedTemplatePath],
            (err: ErrorEvent, generatedPath: string) => {
                if (err) {
                    return done(err);
                }
                this.storage.read(templatePath, (err: ErrorEvent, contents: string) => {
                    if (err) {
                        return done(err);
                    }
                    const renderedContents: string = ComponentCommand
                        .replacePlaceholdersWithData(contents.toString(), this.placeholders);

                    this.storage.create(generatedPath, renderedContents, (err: ErrorEvent) => {
                        if (err) {
                            return done(err);
                        }
                        done(null, i);
                    });
                });
            })
    }

    private onTemplateRendered(err: ErrorEvent, fileIndex: number, isSuccessful: boolean, done: Function) {
        console.log({err5: err})
        if (err) {
            isSuccessful = false;
            const output: Output[] = [
                new Output(
                    `${this.transformedFilePaths[fileIndex]} was not created successfully`,
                    OUTPUT_TYPE.ERROR
                )
            ];
            this.userInterface.showOutput(output, noop);
            return done(err);
        }


        const output: Output[] = [
            new Output(
                `${this.transformedFilePaths[fileIndex]} was created successfully`,
                OUTPUT_TYPE.NORMAL
            )
        ];
        this.userInterface.showOutput(output, noop);
        console.log({err77: fileIndex, asd: this.transformedFilePaths.length - 1, isSuccessful})
        if (fileIndex === this.transformedFilePaths.length - 1 && isSuccessful) {
            console.log({err4: err})
            const output: Output[] = [
                new Output(
                    NEW_COMPONENT_MESSAGE.CREATE_SUCCESS,
                    OUTPUT_TYPE.SUCCESS
                )
            ];
            this.userInterface.showOutput(output, noop);
            return done();
        }
    }

    private renderTemplates(
        filePaths: string[],
        done: Function): void {
        const isSuccessful = true;
        for (let i = 0; i < this.transformedFilePaths.length; i++) {
            this.renderTemplate(
                filePaths[i],
                this.transformedFilePaths[i],
                i,
                (err: ErrorEvent) => this.onTemplateRendered(err, i, isSuccessful, done));
        }
    }

    private getComponentTargetPath(): string {
        const componentTargetPathArg: Flag | undefined = this.getFlag(COMMAND_FLAG.COMPONENT_TARGET_PATH);
        return componentTargetPathArg ? componentTargetPathArg.value : this.path;
    }

    execute(done: Function): void {
        const templatePath: Flag | undefined = this.getFlag(COMMAND_FLAG.TEMPLATE);
        console.log({templatePath, cwd: process.cwd()});
        if (!templatePath) {
            const err = new Error(NEW_COMPONENT_MESSAGE.INVALID_TEMPLATE_PATH);
            return this.onError(err, done);
        }

        this.storage.directoryExists(templatePath.value, (err: ErrorEvent) => {
            console.log({err1: err})
            if (err) {
                return this.onError(new Error(NEW_COMPONENT_MESSAGE.INVALID_TEMPLATE_PATH), done);
            }

            this.targetPath = this.getComponentTargetPath();
            const componentNameArg: Flag | undefined = this.getFlag(COMMAND_FLAG.COMPONENT_NAME);
            if (!componentNameArg) {
                const err = new Error(NEW_COMPONENT_MESSAGE.INVALID_NAME);
                return this.onError(err, done);
            }

            this.storage.scanDirectory(templatePath.value, (err: ErrorEvent, filePaths: string[]) => {
                console.log({err2: err})
                if (err) {
                    return this.onError(err, done);
                }
                const templateParts: string[] = ComponentCommand.getTemplateParts(templatePath.value);
                if (!templateParts || !templateParts.length) {
                    const err = new Error(NEW_COMPONENT_MESSAGE.INVALID_TEMPLATE_PATH);
                    return this.onError(err, done);
                }
                this.templateName = templateParts[templateParts.length - 1];
                this.placeholders = this.extractPlaceholdersFromFlags();
                this.transformedFilePaths = this.transformFilePaths(filePaths, componentNameArg.value);
                this.storage.createPaths(this.targetPath, this.transformedFilePaths, (err: Error) => {
                    console.log({err3: err})
                    if (err) {
                        return this.onError(err, done);
                    }

                    return this.renderTemplates(filePaths, done);
                });
            });
        });
    }
}