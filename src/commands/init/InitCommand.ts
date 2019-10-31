import {sep} from 'path';
import IStorage from '../../services/interfaces/IStorage';
import IUserInterface from '../../user-interface/interfaces/IUserInterface';
import ICra from '../../services/interfaces/ICra';
import Flag from '../Flag';
import {CRA_EVENT, FLAGS_WITH_TEMPLATES, OUTPUT_TYPE} from '../../constants';
import Output from '../Output';
import {noop} from '../../utils';
import IInitCommand from '../interfaces/IInitCommand';
import ITemplate, {IDependency, IFile} from '../interfaces/ITemplate';

export default class InitCommand implements IInitCommand {
    public readonly storage: IStorage;
    public readonly userInterface: IUserInterface;
    public readonly cra: ICra;
    public readonly childProcess: typeof import('child_process');
    public appName: string;
    public flags: Flag[];
    public path: string;

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

    constructor(
        storage: IStorage,
        userInterface: IUserInterface,
        cra: ICra,
        childProcess: typeof import('child_process')
    ) {
        this.storage = storage;
        this.userInterface = userInterface;
        this.cra = cra;
        this.childProcess = childProcess;
    }

    setAppMetadata(appName: string, flags: Flag[], path: string) {
        this.appName = appName;
        this.flags = flags;
        this.path = path;
    }

    initApp(args: string[], done: Function): void {
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

    ejectApp(path: string, done: Function): void {
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

    applyConfigOptions(languageType: string, done: Function): void {
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
                                    new Output('Refreshing node_modules', OUTPUT_TYPE.NORMAL)
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
}
