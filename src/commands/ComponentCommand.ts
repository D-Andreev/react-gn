import ICommand from './interfaces/ICommand';
import Flag from './Flag';
import IStorage from '../services/interfaces/IStorage';
import IUserInterface from '../user-interface/interfaces/IUserInterface';
import {
    COMMAND_FLAG, ENUMERABLE_FLAG_ID,
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
    private separator: string;

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
        this.separator = sep;
    }

    private static isEnumerableFlag(flag: Flag): boolean {
        return flag.name.indexOf(ENUMERABLE_FLAG_ID) !== -1;
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

    private getPlaceholderFlags(): Flag[] {
        const placeholders: Flag[] = [];
        for (let i = 0; i < this.flags.length; i++) {
            const flag: Flag = this.flags[i];
            if (NON_PLACEHOLDER_FLAGS.indexOf(flag.name) !== -1) {
                continue;
            }
            if (ComponentCommand.isEnumerableFlag(flag)) {
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

    private getTemplateParts(templatePath: string): string[] {
        return templatePath
            .split(this.separator)
            .filter((part: string) => part.length);
    }

    private setSeparator(path: string): void {
        if (path.indexOf('/') !== -1) {
            this.separator = '/';
        } else if (path.indexOf('\\') !== -1) {
            this.separator = '\\'
        }
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
            const regex = new RegExp(`${this.templateName}(.*)`, 'gi');
            const matchComponentPath = filePath.match(regex);
            const componentPath = matchComponentPath[0]
                .replace(`${this.templateName}${this.separator}`, '');
            let generatedPath = `${this.targetPath}${this.separator}${componentName}${this.separator}${componentPath}`;
            generatedPath = ComponentCommand.replacePlaceholdersWithData(generatedPath, this.placeholders);
            let componentParts = generatedPath.split(this.separator);
            const indexOfMainPath = componentParts.indexOf(componentName);
            componentParts = componentParts.slice(indexOfMainPath);
            return componentParts.join(this.separator);
        });
    }

    private renderTemplate(templatePath: string, transformedFilePath: string, i: number, done: Function): void {
        const renderedTemplatePath = ComponentCommand
            .replacePlaceholdersWithData(transformedFilePath, this.placeholders);
        const parts: string[] = renderedTemplatePath.split(this.separator);
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
        if (fileIndex === this.transformedFilePaths.length - 1 && isSuccessful) {
            return done();
        }
    }

    private getComponentTargetPath(): string {
        const componentTargetPathArg: Flag | undefined = this.getFlag(COMMAND_FLAG.COMPONENT_TARGET_PATH);
        return componentTargetPathArg ? componentTargetPathArg.value : this.path;
    }

    execute(done: Function): void {
        const templatePath: Flag | undefined = this.getFlag(COMMAND_FLAG.TEMPLATE);
        if (!templatePath) {
            const err = new Error(NEW_COMPONENT_MESSAGE.INVALID_TEMPLATE_PATH);
            return this.onError(err, done);
        }

        this.storage.directoryExists(templatePath.value, (err: ErrorEvent) => {
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
                if (err) {
                    return this.onError(err, done);
                }
                this.setSeparator(templatePath.value);
                const templateParts: string[] = this.getTemplateParts(templatePath.value);
                this.templateName = templateParts[templateParts.length - 1];
                this.placeholders = this.getPlaceholderFlags();
                this.transformedFilePaths = this.transformFilePaths(filePaths, componentNameArg.value);
                this.storage.createPaths(this.targetPath, this.transformedFilePaths, (err: Error) => {
                    if (err) {
                        return this.onError(err, done);
                    }
                    const isSuccessful = true;
                    for (let i = 0; i < this.transformedFilePaths.length; i++) {
                        this.renderTemplate(
                            filePaths[i],
                            this.transformedFilePaths[i],
                            i,
                            (err: ErrorEvent) => this.onTemplateRendered(err, i, isSuccessful, done));
                    }
                });
            });
        });
    }
}
