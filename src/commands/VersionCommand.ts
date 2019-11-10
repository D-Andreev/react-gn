import ICommand from './interfaces/ICommand';
import IStorage from '../services/interfaces/IStorage';
import IUserInterface from '../user-interface/interfaces/IUserInterface';
import {OUTPUT_TYPE} from '../constants';

export default class VersionCommand implements ICommand {
    private readonly storage: IStorage;
    private readonly userInterface: IUserInterface;

    constructor(storage: IStorage, userInterface: IUserInterface) {
        this.storage = storage;
        this.userInterface = userInterface;
    }

    execute(done: Function): void {
        this.storage.read('./package.json', (err: Error, res: string) => {
            if (err) {
                return done(err);
            }

            if (!res) {
                return done(new Error('package.json file not found'));
            }

            let json: {version: string} = {version: ''};
            try {
                json = JSON.parse(res);
            } catch (e) {
                return done(new Error('Could not parse package.json'));
            }

            this.userInterface.showOutput([
                {type: OUTPUT_TYPE.NORMAL, contents: `Version: ${json.version}`},
            ], done);
        });
    }
}
