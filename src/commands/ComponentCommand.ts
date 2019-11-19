import ICommand from './interfaces/ICommand';
import Flag from './Flag';
import IStorage from '../services/interfaces/IStorage';
import IUserInterface from '../user-interface/interfaces/IUserInterface';

export default class ComponentCommand implements ICommand {
    public readonly flags: Flag[];
    public readonly componentName: string;
    public readonly path: string;
    private readonly storage: IStorage;
    private readonly userInterface: IUserInterface;
    public readonly childProcess: typeof import('child_process');

    constructor(
        storage: IStorage,
        userInterface: IUserInterface,
        childProcess: typeof import('child_process'),
        componentName: string,
        flags: Flag[],
        path: string
    ) {
        this.storage = storage;
        this.userInterface = userInterface;
        this.childProcess = childProcess;
        this.componentName = componentName;
        this.flags = flags;
        this.path = path;
    }

    execute(done: Function): void {
        console.log('a', this.flags);
    }
}
