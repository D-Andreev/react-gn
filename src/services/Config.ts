import IConfig from './interfaces/IConfig';
import Flag from '../commands/Flag';
import IConfigOptions from './interfaces/IConfigOptions';
import {DEFAULT_CONFIG} from '../constants';

export default class Config implements IConfig {
    private readonly flags: Flag[];
    private readonly configOptions: IConfigOptions;

    constructor(flags: Flag[]) {
        this.flags = flags;
        this.configOptions = DEFAULT_CONFIG;
        this.flags.forEach((flag: Flag) =>
            this.configOptions[flag.name] = flag.value);
    }

    getOptions(done: Function): void {
        done(null, this.configOptions);
    }

    getOption(name: string, done: Function): void {
        if (!this.configOptions.hasOwnProperty(name)) {
            return done(new Error('Option not found'));
        }

        done(null, this.configOptions[name]);
    }

    setOption(name: string, value: string, done: Function): void {
        this.configOptions[name] = value;
        done(null, this.configOptions[name]);
    }
}
