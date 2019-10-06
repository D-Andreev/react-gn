import IStorage from '../../services/interfaces/IStorage';
import IUserInterface from '../../user-interface/interfaces/IUserInterface';
import Flag from '../Flag';
import ICra from '../../services/interfaces/ICra';
import InitCommand from './InitCommand';
import ICommand from '../interfaces/ICommand';
import {COMMAND_FLAG} from '../../constants';
import * as path from 'path';

export default class JsAppCommand extends InitCommand implements ICommand {
    public readonly flags: Flag[];
    public readonly appName: string;
    public readonly path: string;

    constructor(
        storage: IStorage, userInterface: IUserInterface, cra: ICra, appName: string, flags: Flag[], path: string) {
        super(storage, userInterface, cra, appName, flags, path);
    }

    initApp(args: string[], done: Function): void {
        super.initApp(args, done);
    }

    ejectApp(path: string, done: Function): void {
        super.ejectApp(path, done);
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
                 this.ejectApp(path.join(this.path, this.appName), done);
            } else {
                done();
            }
        });
    }
}