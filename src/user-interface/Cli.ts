import IUserInterface from './interfaces/IUserInterface';
import {ERROR, OUTPUT_TYPE} from '../constants';
import Output from '../commands/Output';
import {FgBlue, FgGreen, FgWhite} from './colors';

export default class Cli implements IUserInterface {
    private readonly console: Console;
    private readonly colorsMap: { [type: string]: string };

    constructor(console: Console) {
        this.console = console;
        this.colorsMap = {
            [OUTPUT_TYPE.NORMAL]: FgWhite,
            [OUTPUT_TYPE.INFO]: FgBlue,
            [OUTPUT_TYPE.SUCCESS]: FgGreen,
        };
    }

    showOutput(output: Output[], done: Function) {
        if (!output || !output.length) {
            done(new Error(ERROR.INVALID_OUTPUT));
        }

        output.forEach((line: Output) => {
            const color: string = this.colorsMap[line.type] || this.colorsMap[OUTPUT_TYPE.NORMAL];
            console.log('', color);
            this.console.log(line.contents);
        });
        done();
    }
}
