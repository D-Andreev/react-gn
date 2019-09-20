import ICommand from './interfaces/ICommand';
import IStorage from '../services/interfaces/IStorage';

export default class TsAppCommand implements ICommand {
    private readonly storage: IStorage;
    private readonly appName: string;
    private readonly flags: string[];

    constructor(storage: IStorage, appName: string, flags: string[]) {
        this.storage = storage;
        this.appName = appName;
        this.flags = flags;
    }

    execute(): void {
        console.log('TS APP COMMAND');
    }
}
