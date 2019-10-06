import IStorage from '../../services/interfaces/IStorage';
import IUserInterface from '../../user-interface/interfaces/IUserInterface';
import Flag from '../Flag';
import ICra from '../../services/interfaces/ICra';
import InitCommand from './InitCommand';
import ICommand from '../interfaces/ICommand';

export default class JsAppCommand extends InitCommand implements ICommand {

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

            done();
        })
    }
}
