import ICommand from './interfaces/ICommand';
import IStorage from '../services/interfaces/IStorage';
import IUserInterface from '../services/interfaces/IUserInterface';
import {OUTPUT_TYPE, PACKAGE_VERSION} from '../constants';

export default class VersionCommand implements ICommand {
    private readonly storage: IStorage;
    private readonly userInterface: IUserInterface;

    constructor(storage: IStorage, userInterface: IUserInterface) {
        this.storage = storage;
        this.userInterface = userInterface;
    }

    execute(done: Function): void {
        this.userInterface.showOutput([
            {type: OUTPUT_TYPE.NORMAL, contents: `Version: ${PACKAGE_VERSION}`},
        ], done);
    }
}
