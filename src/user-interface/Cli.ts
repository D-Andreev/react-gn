import IUserInterface from './interfaces/IUserInterface';
import {ERROR, OUTPUT_TYPE} from '../constants';
import Output from '../commands/Output';
import {FgWhite} from './colors';

export default class Cli implements IUserInterface {
    private readonly console: Console;
    private readonly colorsMap: { [type: string]: string };

    constructor(console: Console) {
        this.console = console;
        this.colorsMap = {
            [OUTPUT_TYPE.NORMAL]: FgWhite,
        };
    }

    showOutput(output: Output[], done: Function) {
        if (!output || !output.length) {
            done(new Error(ERROR.INVALID_OUTPUT));
        }

        output.forEach((line: Output) => {
            const color: string = this.colorsMap[line.type] || this.colorsMap[OUTPUT_TYPE.NORMAL];
            this.console.log(line.contents, color);
        });
        done();
    }
}
