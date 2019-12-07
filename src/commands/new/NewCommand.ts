import {sep} from 'path';
import IStorage from '../../services/interfaces/IStorage';
import IUserInterface from '../../user-interface/interfaces/IUserInterface';
import ICra from '../../services/interfaces/ICra';
import Flag from '../Flag';
import {CRA_EVENT, FLAGS_WITH_TEMPLATES, LANGUAGE_TYPE, OUTPUT_TYPE, QUESTION} from '../../constants';
import Output from '../Output';
import {isAffirmativeAnswer, noop} from '../../utils';
import ITemplate, {IDependency, IFile} from '../interfaces/ITemplate';
import * as path from 'path';
import ICommand from '../interfaces/ICommand';
import steed from 'steed';
import INewCommandAnswers from '../interfaces/INewCommandAnswers';

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
                const contents = `Adding ${flagWithTemplate}`;
                const output: Output[] = [new Output(contents, OUTPUT_TYPE.INFO)];
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

    private installTemplateDependencies(templateDependencies: IDependency[] | IFile[], done: Function): void {
        for (let i = 0; i < templateDependencies.length; i++) {
            const current: any = templateDependencies[i];
            const version = current.version ? `@${current.version}` : '';
            const devFlag = current.isDev ? '--save-dev' : '';
            try {
                this.childProcess.execSync(
                    `cd ${this.getAppPath()} && npm install ${current.name}${version}${devFlag}`);
            } catch (e) {
                const output: Output[] = [new Output(e.message, OUTPUT_TYPE.ERROR)];
                this.userInterface.showOutput(output, noop);
                return done(e);
            }
        }

        done();
    }

    private getFilePaths(template: ITemplate, languageType: string): string[] {
        return Object
            .keys(template)
            .filter((key: string) =>
                key !== 'dependencies' && template[key].hasOwnProperty(languageType));
    }

    private removeFile(i: number, filesToBeRemoved: string[], done: Function) {
        if (i === filesToBeRemoved.length) {
            return done();
        }

        this.storage.delete(filesToBeRemoved[i], (err: Error) => {
            if (err) {
                return done(err);
            }

            this.removeFile(++i, filesToBeRemoved, done);
        });
    }

    private removeFiles(template: any, paths: string[], languageType: string, done: Function): void {
        let filesToBeRemoved: string[] = [];
        for (let i = 0; i < paths.length; i++) {
            const removeFilesList = template[paths[i]][languageType].removeFiles;
            if (removeFilesList && removeFilesList.length) {
                filesToBeRemoved = filesToBeRemoved.concat(removeFilesList);
            }
        }
        filesToBeRemoved = filesToBeRemoved.map((file: string) =>
            `${this.getAppPath()}${sep}${file}`
        );

        this.removeFile(0, filesToBeRemoved, done);
    }

    private applyConfigOptions(languageType: string, done: Function): void {
        const flagsWithTemplates: string[] = this.getFlagsWithTemplates();
        if (!flagsWithTemplates.length) {
            return done(new Error('No flags with templates found'));
        }

        for (let i = 0; i < flagsWithTemplates.length; i++) {
            const flagWithTemplate: string = flagsWithTemplates[i];
            let template: any = null;
            try {
                template = this.getTemplateByFlag(flagWithTemplate);
            } catch (e) {
                return this.onError(e, done);
            }

            const paths: string[] = this.getFilePaths(template, languageType);
            this.removeFiles(template, paths, languageType, (err: Error) => {
                if (err) {
                    return this.onError(err, done);
                }

                this.storage.createPaths(this.getAppPath(), paths, (err: Error) => {
                    if (err) {
                        return this.onError(err, done);
                    }

                    const output: Output[] = [
                        new Output('Installing dependencies...', OUTPUT_TYPE.NORMAL)
                    ];
                    this.userInterface.showOutput(output, noop);
                    this.installTemplateDependencies(template.dependencies[languageType], (err: Error) => {
                        if (err) {
                            return this.onError(err, done);
                        }

                        this.saveFiles(0, languageType, paths, template, (err: Error) => {
                            if (err) {
                                return this.onError(err, done);
                            }

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

                            const contents = 'node_modules were installed successfully!';
                            const output: Output[] = [new Output(contents, OUTPUT_TYPE.SUCCESS)];
                            this.userInterface.showOutput(output, noop);
                            done();
                        });
                    });
                });
            });
        }
    }

    private askQuestions(done: Function): void {
        const input = [QUESTION.TS, QUESTION.REDUX, QUESTION.EJECTED];
        steed.mapSeries(input, (question: string, cb: Function) => {
            this.userInterface.askQuestion(question, cb);
        }, (err: ErrorEvent, results: string[]) => {
            if (err) {
                return done(err);
            }
            const answers: INewCommandAnswers = {
                languageType: results[0] === LANGUAGE_TYPE.TS ? LANGUAGE_TYPE.TS : LANGUAGE_TYPE.JS,
                withRedux: isAffirmativeAnswer(results[1]),
                ejected: isAffirmativeAnswer(results[2])
            };
            done(null, answers);
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
                const contents = `${this.appName} was generated successfully!`;
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
        let languageType = '';
        steed.waterfall([
            (next: Function) => this.askQuestions(next),
            (answers: INewCommandAnswers, next: Function) => {
                const args = [];
                if (answers.languageType === LANGUAGE_TYPE.TS) {
                    args.push('--typescript');
                }
                this.initApp(args, (err: ErrorEvent) => next(err, answers));
            },
            (answers: INewCommandAnswers, next: Function) => {
            console.log({answers})
                console.log({
                    languageTye: answers.languageType,
                    ejected: answers.ejected,
                    a: answers.withRedux,
                    answers
                });
                if (answers.withRedux) {
                    this.flags.push({name: FLAGS_WITH_TEMPLATES.WITH_REDUX, value: ''});
                }
                if (answers.ejected) {
                    this.ejectApp(path.join(this.path, this.appName), (err: Error) => {
                        if (err) {
                            return next(err);
                        }

                        this.applyConfigOptions(languageType, next);
                    });
                } else {
                    this.applyConfigOptions(languageType, next);
                }
            }
        ], (err: ErrorEvent) => done(err));
    }
}
