import IStorage from '../../services/interfaces/IStorage';
import IUserInterface from '../../user-interface/interfaces/IUserInterface';
import Flag from '../Flag';
import InitAppCommand from './InitAppCommand';

export default class JsAppCommand extends InitAppCommand {
    constructor(storage: IStorage, userInterface: IUserInterface, appName: string, flags: Flag[]) {
        super(storage, userInterface, appName, flags);
    }

    execute(): void {
        console.log('JS APP COMMAND', super.userInterface);
        super.storage.scanDirectory('C:\\workspace\\my-app', (err: any, res: any) => {
            console.log(err, res);
        });
    }
}
