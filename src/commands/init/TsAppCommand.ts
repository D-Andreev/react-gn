import ICommand from '../interfaces/ICommand';
import IStorage from '../../services/interfaces/IStorage';
import IUserInterface from '../../user-interface/interfaces/IUserInterface';
import Flag from '../Flag';
import ICra from '../../services/interfaces/ICra';

export default class TsAppCommand implements ICommand {
    private readonly storage: IStorage;
    private readonly userInterface: IUserInterface;
    private readonly cra: ICra;
    private readonly appName: string;
    private readonly flags: Flag[];

    constructor(storage: IStorage, userInterface: IUserInterface, cra: ICra, appName: string, flags: Flag[]) {
        this.storage = storage;
        this.userInterface = userInterface;
        this.appName = appName;
        this.flags = flags;
    }

    execute(): void {
        console.log('TS APP COMMAND');
    }
}
