import IStorage from '../../services/interfaces/IStorage';
import IUserInterface from '../../user-interface/interfaces/IUserInterface';
import Flag from '../Flag';
import ICra from '../../services/interfaces/ICra';
import InitCommand from './InitCommand';
import ICommand from '../interfaces/ICommand';
import {COMMAND_FLAG, LANGUAGE_TYPE} from '../../constants';
import * as path from 'path';

export default class JsAppCommand extends InitCommand implements ICommand {
    public flags: Flag[];
    public appName: string;
    public path: string;

    constructor(
        storage: IStorage,
        userInterface: IUserInterface,
        cra: ICra,
        childProcess: typeof import('child_process')
    ) {
        super(storage, userInterface, cra, childProcess);
    }

    setAppMetadata(appName: string, flags: Flag[], path: string): void {
        super.setAppMetadata(appName, flags, path);
        this.appName = appName;
        this.flags = flags;
        this.path = path;
    }

    initApp(args: string[], done: Function): void {
        super.initApp(args, done);
    }

    ejectApp(path: string, done: Function): void {
        super.ejectApp(path, done);
    }

    applyConfigOptions(languageType: string, done: Function): void {
        super.applyConfigOptions(languageType, done);
    }

    execute(done: Function): void {
        this.initApp([], (err: Error) => {
            if (err) {
                return done(err);
            }
            const ejectFlag: Flag | undefined = this.flags.find((flag: Flag) => {
                return flag.name === COMMAND_FLAG.EJECTED;
            });
            if (ejectFlag) {
                 this.ejectApp(path.join(this.path, this.appName), (err: Error) => {
                     if (err) {
                         return done(err);
                     }

                     this.applyConfigOptions(LANGUAGE_TYPE.JS, done);
                 });
            } else {
                this.applyConfigOptions(LANGUAGE_TYPE.JS, done);
            }
        });
    }
}
