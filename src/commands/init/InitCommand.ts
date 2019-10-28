import IStorage from '../../services/interfaces/IStorage';
import IUserInterface from '../../user-interface/interfaces/IUserInterface';
import ICra from '../../services/interfaces/ICra';
import Flag from '../Flag';
import {CRA_EVENT, FLAGS_WITH_TEMPLATES, OUTPUT_TYPE} from '../../constants';
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

    private static getTemplateByFlag(flagWithTemplate: string): ITemplate {
        let template: ITemplate = null;

        switch (flagWithTemplate) {
            case FLAGS_WITH_TEMPLATES.WITH_REDUX:
                template = require('./templates/with-redux');
                break;
            default:
                throw new Error('No such template');
        }

        return template;
    }

    private getFlagsWithTemplates(): string[] {
        return this.flags
            .map((flag: Flag) => flag.name)
            .filter((flagName: string) => FLAGS_WITH_TEMPLATES.hasOwnProperty(flagName));
    }

    private saveFiles(i: number, languageType: string, paths: string[], template: any, done: Function): void {
        if (i === paths.length) {
            return done();
        }

        this.storage.directoryExists(paths[i], (err: Error) => {
            if (err) {
                const fileName = `${paths[i]}.${template[paths[i]][languageType].extension}`;
                this.storage.create(fileName, template[paths[i]][languageType].contents, (err: Error) => {
                    if (err) {
                        return done(err);
                    }

                    this.saveFiles(++i, languageType, paths, template, done);
                });
            } else {
                // modify the file
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
                template = InitCommand.getTemplateByFlag(flagWithTemplate);
            } catch (e) {
                return done(e);
            }

            const paths: string[] = Object
                .keys(template)
                .filter((key: string) => key !== 'dependencies');
            this.storage.createPaths(this.path, paths, (err: Error) => {
                if (err) {
                    return done(err);
                }

                for (let i = 0; i < template.dependencies[languageType].length; i++) {
                    const current: any = template.dependencies[languageType][i];
                    const version = current.version ? `@${current.version}` : '';
                    const devFlag = current.isDev ? '--save-dev' : '';
                    try {
                        this.childProcess.execSync(`npm install ${current.name}${version}${devFlag}`);
                    } catch (e) {
                        return done(e);
                    }
                }

                this.saveFiles(0, languageType, paths, template, done);
            });
        }
    }
}
