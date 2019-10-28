import {sep} from 'path';
import IStorage from '../../services/interfaces/IStorage';
import IUserInterface from '../../user-interface/interfaces/IUserInterface';
import ICra from '../../services/interfaces/ICra';
import Flag from '../Flag';
import {COMMAND_FLAG, CRA_EVENT, FLAGS_WITH_TEMPLATES, OUTPUT_TYPE} from '../../constants';
import Output from '../Output';
import {noop} from '../../utils';
import IInitCommand from '../interfaces/IInitCommand';
import ITemplate from '../interfaces/ITemplate';

export default class InitCommand implements IInitCommand {
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
            .filter((flagName: string) => flagName !== COMMAND_FLAG.EJECTED)
            .filter((flagName: string) =>
                Object.values(FLAGS_WITH_TEMPLATES).indexOf(flagName) !== 1);
    }

    private onSaveFileError(fileName: string, err: Error, done: Function): void {
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
                        return this.onSaveFileError(paths[i], err, done);
                    }
                    const contents = `${paths[i]} was created successfully!`;
                    const output: Output[] = [new Output(contents, OUTPUT_TYPE.SUCCESS)];
                    this.userInterface.showOutput(output, noop);
                    this.saveFiles(++i, languageType, paths, template, done);
                });
            } else {
                // In the future manually editing the file using CodeGenerator might be possible.
                /* Here are the possible changes that might be needed.
                    * get steps from config
                    * Add CodeGenerator as dep.
                    * read the file and get contents
                    * execute each step with function from CodeGenerator with contents passed from file
                *  */
                // But for now we are just updating the file with the content from the template.
                this.storage.update(fileName, template[paths[i]][languageType].contents, (err: Error) => {
                    if (err) {
                        return this.onSaveFileError(paths[i], err, done);
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
        console.log('ffff', flagsWithTemplates, this.flags);
        if (!flagsWithTemplates.length) {
            return done(new Error('No flags with templates found'));
        }

        for (let i = 0; i < flagsWithTemplates.length; i++) {
            const flagWithTemplate: string = flagsWithTemplates[i];
            let template: any = null;
            try {
                template = this.getTemplateByFlag(flagWithTemplate);
            } catch (e) {
                return done(e);
            }

            const paths: string[] = Object
                .keys(template)
                .filter((key: string) => key !== 'dependencies');
            this.storage.createPaths(this.getAppPath(), paths, (err: Error) => {
                if (err) {
                    return done(err);
                }
                for (let i = 0; i < template.dependencies[languageType].length; i++) {
                    const current: any = template.dependencies[languageType][i];
                    const version = current.version ? `@${current.version}` : '';
                    const devFlag = current.isDev ? '--save-dev' : '';
                    try {
                        this.childProcess.execSync(
                            `cd ${this.getAppPath()} && npm install ${current.name}${version}${devFlag}`);
                    } catch (e) {
                        return done(e);
                    }
                }

                this.saveFiles(0, languageType, paths, template, (err: Error) => {
                    if (err) {
                        return done(err);
                    }

                    try {
                        this.childProcess.execSync(
                            `rm -rf ${this.getAppPath()}${sep}node_modules && npm install`);
                    } catch (e) {
                        const output: Output[] = [new Output(e.message, OUTPUT_TYPE.ERROR)];
                        this.userInterface.showOutput(output, noop);
                        return done(e);
                    }

                    const contents = 'node_modules were installed successfully!';
                    const output: Output[] = [new Output(contents, OUTPUT_TYPE.SUCCESS)];
                    this.userInterface.showOutput(output, noop);
                    done();
                });
            });
        }
    }
}
