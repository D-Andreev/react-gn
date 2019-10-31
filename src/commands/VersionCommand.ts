import ICommand from './interfaces/ICommand';
import IStorage from '../services/interfaces/IStorage';
import IUserInterface from '../user-interface/interfaces/IUserInterface';
import {OUTPUT_TYPE} from '../constants';
import Flag from './Flag';
import {inject, injectable} from 'tsyringe';

@injectable()
export default class VersionCommand implements ICommand {
    public flags: Flag[];
    public appName: string;
    public path: string;

    constructor(@inject('storage') private readonly storage: IStorage,
                @inject('userInterface') private readonly userInterface: IUserInterface) {
    }

    setAppMetadata(appName: string, flags: Flag[], path: string): void {
        this.appName = appName;
        this.flags = flags;
        this.path = path;
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
