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
    FLAGS_WITH_TEMPLATES,
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

    private static getTemplateParts(templatePath: string): string[] {
        return templatePath
            .split(sep)
            .filter((part: string) => part.length);
    }

    private getPlaceholderFlags(): Flag[] {
        const placeholders: Flag[] = [];
        for (let i = 0; i < this.flags.length; i++) {
            const flag: Flag = this.flags[i];
            if (NON_PLACEHOLDER_FLAGS.indexOf(flag.name) !== -1) {
                continue;
            }
            if (GenerateCommand.isEnumerableFlag(flag)) {
                const split: string[] = flag.value.split(',');
                for (let j = 0; j < split.length; j++) {
                    placeholders.push({
                        name: `${flag.name.replace(ENUMERABLE_FLAG_ID, '')}${j + 1}`,
                        value: split[j]
                    });
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
            const regex = new RegExp(`${this.templateName}(.*)`, 'gi');
            const matchComponentPath = filePath.match(regex);
            const componentPath = matchComponentPath[0]
                .replace(`${this.templateName}${sep}`, '');
            let generatedPath = `${this.targetPath}${sep}${componentName}${sep}${componentPath}`;
            generatedPath = GenerateCommand.replacePlaceholdersWithData(generatedPath, this.placeholders);
            let componentParts = generatedPath.split(sep);
            const indexOfMainPath = componentParts.indexOf(componentName);
            componentParts = componentParts.slice(indexOfMainPath);
            return componentParts.join(sep);
        });
    }

    private renderTemplate(templatePath: string, transformedFilePath: string, i: number, done: Function): void {
        const renderedTemplatePath = GenerateCommand
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
                    const renderedContents: string = GenerateCommand
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
                OUTPUT_TYPE.SUCCESS
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
                targetPath: results[GENERATE_QUESTION_NAME.TARGET_PATH],
                componentName: results[GENERATE_QUESTION_NAME.COMPONENT_NAME],
                languageType: results[GENERATE_QUESTION_NAME.USE_TS] ? LANGUAGE_TYPE.TS : LANGUAGE_TYPE.JS,
                isClassComponent: results[GENERATE_QUESTION_NAME.IS_CLASS_COMPONENT],
                withPropTypes: results[GENERATE_QUESTION_NAME.OPTIONS].find((o: any) => o.name === ''),
                withStyledComponents: false,
                withState: false,
                withRedux: false,
                withHooks: false,
            };
            done(null, answers);
        });
    }

    execute(done: Function): void {
        steed.waterfall([
            (next: Function) => this.askQuestions(next),
            (answers: IGenerateAnswers, next: Function) => {
                console.log('answers', answers);
                next();
            },
        ], (err: ErrorEvent) => {
            if (err) {
                return done(err);
            }

            done();
        });
    }
}
