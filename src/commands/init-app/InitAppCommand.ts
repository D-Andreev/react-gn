import ICommand from '../interfaces/ICommand';
import IStorage from '../../services/interfaces/IStorage';
import IUserInterface from '../../user-interface/interfaces/IUserInterface';
import Flag from '../Flag';

export default abstract class InitAppCommand implements ICommand {
    protected readonly storage: IStorage;
    protected readonly userInterface: IUserInterface;
    protected readonly appName: string;
    protected readonly flags: Flag[];

    protected constructor(storage: IStorage, userInterface: IUserInterface, appName: string, flags: Flag[]) {
        this.storage = storage;
        this.userInterface = userInterface;
        this.appName = appName;
        this.flags = flags;
    }

    execute(done: Function): void {

    }
}
