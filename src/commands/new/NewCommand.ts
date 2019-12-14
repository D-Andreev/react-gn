import {sep} from 'path';
import IStorage from '../../services/interfaces/IStorage';
import IUserInterface from '../../user-interface/interfaces/IUserInterface';
import ICra from '../../services/interfaces/ICra';
import Flag from '../Flag';
import {
    CRA_EVENT,
    FLAGS_WITH_TEMPLATES,
    FLAGS_WITH_TEMPLATES_WITH_REDUX_NAME,
    LANGUAGE_TYPE,
    OUTPUT_TYPE,
    NEW_COMMAND_QUESTIONS, NEW_COMMAND_QUESTION_MESSAGES, COMMAND_FLAG
} from '../../constants';
import Output from '../Output';
import {noop} from '../../utils';
import ITemplate, {IDependency} from '../interfaces/ITemplate';
import * as path from 'path';
import ICommand from '../interfaces/ICommand';
import steed from 'steed';
import INewAnswers from '../interfaces/INewAnswers';
import {Answers, CheckboxQuestion} from 'inquirer';

export default class NewCommand implements ICommand {
    public readonly storage: IStorage;
    public readonly userInterface: IUserInterface;
    public readonly cra: ICra;
    public readonly appName: string;
    public readonly flags: Flag[];
    public readonly path: string;
    public readonly childProcess: typeof import('child_process');

    private getTemplateByFlag(flagWithTemplate: string): ITemplate {
        let template: ITemplate = null;

        switch (flagWithTemplate) {
            case FLAGS_WITH_TEMPLATES.WITH_REDUX:
                const contents = `Installing ${FLAGS_WITH_TEMPLATES_WITH_REDUX_NAME[flagWithTemplate]}...`;
                const output: Output[] = [new Output(contents, OUTPUT_TYPE.NORMAL)];
                this.userInterface.showOutput(output, noop);
                template = require('./templates/with-redux').default;
                break;
            default:
                throw new Error('No such template');
        }

        return template;
    }

    private getFlagsWithTemplates(): string[] {
        return this.flags
            .map((flag: Flag) => flag.name)
            .filter((flagName: string) => Object.values(FLAGS_WITH_TEMPLATES).includes(flagName))
    }

    private onError(err: Error, done: Function): void {
        const output: Output[] = [new Output(err.message, OUTPUT_TYPE.ERROR)];
        this.userInterface.showOutput(output, noop);
        return done(err);
    }

    private saveFiles(i: number, languageType: string, paths: string[], template: any, done: Function): void {
        if (i === paths.length) {
            return done();
        }
        const fileName = `${this.getAppPath()}${sep}${paths[i]}.${template[paths[i]][languageType].extension}`;
        this.storage.directoryExists(fileName, (err: Error) => {
            if (err) {
                this.storage.create(fileName, template[paths[i]][languageType].contents, (err: Error) => {
                    if (err) {
                        return this.onError(err, done);
                    }
                    const contents = `${paths[i]} was created successfully!`;
                    const output: Output[] = [new Output(contents, OUTPUT_TYPE.SUCCESS)];
                    this.userInterface.showOutput(output, noop);
                    this.saveFiles(++i, languageType, paths, template, done);
                });
            } else {
                this.storage.update(fileName, template[paths[i]][languageType].contents, (err: Error) => {
                    if (err) {
                        return this.onError(err, done);
                    }
                    const contents = `${paths[i]} was updated successfully!`;
                    const output: Output[] = [new Output(contents, OUTPUT_TYPE.SUCCESS)];
                    this.userInterface.showOutput(output, noop);
                    this.saveFiles(++i, languageType, paths, template, done);
                });
            }
        });
    }

    private getAppPath(): string {
        return `${this.path}${sep}${this.appName}`;
    }

    private installTemplateDependencies(templateDependencies: IDependency[], done: Function): void {
        steed.mapSeries(templateDependencies, (current: IDependency, next: Function) => {
            const version = current.version ? `@${current.version}` : '';
            const devFlag = current.isDev ? '--save-dev' : '';
            try {
                this.childProcess.execSync(
                    `cd ${this.getAppPath()} && npm install ${current.name}${version}${devFlag}`);
            } catch (e) {
                const output: Output[] = [new Output(e.message, OUTPUT_TYPE.ERROR)];
                this.userInterface.showOutput(output, noop);
                next(e);
            }
            const output: Output[] = [
                new Output(`Installed ${current.name} successfully!`, OUTPUT_TYPE.SUCCESS)
            ];
            this.userInterface.showOutput(output, next);
        }, (err: ErrorEvent) => done(err));
    }

    private getFilePaths(template: ITemplate, languageType: string): string[] {
        return Object
            .keys(template)
            .filter((key: string) =>
                key !== 'dependencies' && template[key].hasOwnProperty(languageType));
    }

    private removeFiles(template: any, paths: string[], languageType: string, done: Function): void {
        let filesToBeRemoved: string[] = [];
        paths.reduce((acc: string[], path: string) => {
            return acc.concat(template[path][languageType].removeFiles || []);
        }, filesToBeRemoved);
        filesToBeRemoved = filesToBeRemoved
            .filter(f => f.length)
            .map(file => `${this.getAppPath()}${sep}${file}`)
            .filter((v, i) => filesToBeRemoved.indexOf(v) === i);
        steed.mapSeries(filesToBeRemoved, (filePath: string, next: Function) => {
            this.storage.delete(filePath, next);
        }, (err: ErrorEvent) => done(err));
    }

    private appCreated(done: Function): void {
        const contents = `${this.appName} has been created successfully!`;
        const output: Output[] = [new Output(contents, OUTPUT_TYPE.SUCCESS)];
        this.userInterface.showOutput(output, done);
    }

    private installNodeModules(done: Function): void {
        try {
            const output: Output[] = [
                new Output('Installing node_modules', OUTPUT_TYPE.NORMAL)
            ];
            this.userInterface.showOutput(output, noop);
            this.childProcess.execSync(
                `cd ${this.getAppPath()}${sep} && rm -rf ./node_modules && npm install`);
        } catch (e) {
            return this.onError(e, done);
        }

        done();
    }

    private applyConfigOptions(languageType: string, done: Function): void {
        const flagsWithTemplates: string[] = this.getFlagsWithTemplates();
        if (!flagsWithTemplates.length) {
            return done();
        }
        const contents = 'Applying configurations...';
        const output: Output[] = [new Output(contents, OUTPUT_TYPE.NORMAL)];
        this.userInterface.showOutput(output, noop);
        steed.mapSeries(flagsWithTemplates, (flag: string, cb: Function) => {
            let template: any = null;
            try {
                template = this.getTemplateByFlag(flag);
            } catch (e) {
                return this.onError(e, cb);
            }

            const paths: string[] = this.getFilePaths(template, languageType);
            steed.waterfall([
                (next: Function) => this.removeFiles(template, paths, languageType, next),
                (next: Function) => this.storage.createPaths(this.getAppPath(), paths, next),
                (next: Function) => this.installTemplateDependencies(template.dependencies[languageType], next),
                (next: Function) =>
                    this.saveFiles(flagsWithTemplates.indexOf(flag), languageType, paths, template, next)
            ], (err: ErrorEvent) => cb(err));
        }, (err: ErrorEvent) => {
            if (err) {
                return done(err);
            }
            return this.installNodeModules((err: ErrorEvent) => done(err));
        });
    }

    private initApp(args: string[], done: Function): void {
        this.cra.createApp(this.appName, this.path, args);
        this.cra.on(CRA_EVENT.INIT_ERROR, (err: ErrorEvent) => {
            const output: Output[] = [new Output(err.toString(), OUTPUT_TYPE.ERROR)];
            this.userInterface.showOutput(output, noop);
            done(err);
        });
        this.cra.on(CRA_EVENT.INIT_DATA, (data: string) => {
            this.userInterface.showOutput([new Output(data, OUTPUT_TYPE.NORMAL)], noop);
        });
        this.cra.on(CRA_EVENT.INIT_CLOSE, (code: number) => {
            if (code === 0) {
                const contents = 'create-react-app has been generated!';
                const output: Output[] = [new Output(contents, OUTPUT_TYPE.SUCCESS)];
                this.userInterface.showOutput(output, () => done());
            } else {
                const contents = `CRA exited with ${code}`;
                const output: Output[] = [new Output(contents, OUTPUT_TYPE.ERROR)];
                this.userInterface.showOutput(output, noop);
                done(new Error(contents));
            }
        });
    }

    private ejectApp(path: string, done: Function): void {
        this.cra.ejectApp(path);
        this.cra.on(CRA_EVENT.EJECT_ERROR, (err: ErrorEvent) => {
            const output: Output[] = [new Output(err.toString(), OUTPUT_TYPE.ERROR)];
            this.userInterface.showOutput(output, noop);
            done(err);
        });
        this.cra.on(CRA_EVENT.EJECT_DATA, (data: string) => {
            this.userInterface.showOutput([new Output(data, OUTPUT_TYPE.NORMAL)], noop);
        });
        this.cra.on(CRA_EVENT.EJECT_CLOSE, (code: number) => {
            if (code === 0) {
                const contents = `${this.appName} was ejected successfully!`;
                const output: Output[] = [new Output(contents, OUTPUT_TYPE.SUCCESS)];
                this.userInterface.showOutput(output, noop);
                done();
            } else {
                const contents = `CRA exited with ${code}`;
                const output: Output[] = [new Output(contents, OUTPUT_TYPE.ERROR)];
                this.userInterface.showOutput(output, noop);
                done(new Error(contents));
            }
        });
    }

    private askQuestions(done: Function): void {
        if (this.flags.find((f: Flag) => f.name === COMMAND_FLAG.INTERACTIVE && f.value === 'false')) {
            return done(null, {
                languageType: this.flags.find((f: Flag) => f.name === COMMAND_FLAG.TS) ?
                    LANGUAGE_TYPE.TS : LANGUAGE_TYPE.JS,
                withRedux: this.flags.find((f: Flag) => f.name === FLAGS_WITH_TEMPLATES.WITH_REDUX),
                ejected: this.flags.find((f: Flag) => f.name === COMMAND_FLAG.EJECTED),
            });
        }
        steed.mapSeries(NEW_COMMAND_QUESTIONS, (question: CheckboxQuestion, cb: Function) => {
            this.userInterface.prompt(question, cb);
        }, (err: ErrorEvent, results: Answers) => {
            if (err) {
                return done(err);
            }
            const answers: INewAnswers = {
                languageType: results[0].options.indexOf(NEW_COMMAND_QUESTION_MESSAGES.USE_TS) ?
                    LANGUAGE_TYPE.TS : LANGUAGE_TYPE.JS,
                withRedux: results[0].options.indexOf(NEW_COMMAND_QUESTION_MESSAGES.USE_REDUX) !== -1,
                ejected: results[0].options.indexOf(NEW_COMMAND_QUESTION_MESSAGES.EJECT_APP) !== -1
            };
            done(null, answers);
        });
    }

    constructor(
        storage: IStorage,
        userInterface: IUserInterface,
        cra: ICra,
        childProcess: typeof import('child_process'),
        appName: string,
        flags: Flag[],
        path: string
    ) {
        this.storage = storage;
        this.userInterface = userInterface;
        this.cra = cra;
        this.appName = appName;
        this.flags = flags;
        this.path = path;
        this.childProcess = childProcess;
    }

    execute(done: Function): void {
        steed.waterfall([
            (next: Function) => this.askQuestions(next),
            (answers: INewAnswers, next: Function) => {
                const args = [];
                if (answers.languageType === LANGUAGE_TYPE.TS) {
                    args.push('--template typescript');
                }
                this.initApp(args, (err: ErrorEvent) => next(err, answers));
            },
            (answers: INewAnswers, next: Function) => {
                if (answers.withRedux) {
                    this.flags.push({name: FLAGS_WITH_TEMPLATES.WITH_REDUX, value: ''});
                }

                if (!answers.ejected) {
                    return this.applyConfigOptions(answers.languageType, next);
                }
                this.ejectApp(path.join(this.path, this.appName), (err: Error) => {
                    if (err) {
                        return next(err);
                    }

                    this.applyConfigOptions(answers.languageType, next);
                });
            }
        ], (err: ErrorEvent) => {
            if (err) {
                return done(err);
            }
            return this.appCreated(done);
        });
    }
}
