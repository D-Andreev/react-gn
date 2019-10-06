import {Interface} from 'readline';
import IUserInterface from './interfaces/IUserInterface';
import {ERROR, OUTPUT_TYPE} from '../constants';
import Output from '../commands/Output';
import {FgBlue, FgGreen, FgRed, FgWhite} from './colors';

export default class Cli implements IUserInterface {
    private readonly console: Console;
    private readonly readline: typeof import('readline');
    private readonly colorsMap: { [type: string]: string };

    constructor(console: Console, readline: typeof import('readline')) {
        this.console = console;
        this.readline = readline;
        this.colorsMap = {
            [OUTPUT_TYPE.NORMAL]: FgWhite,
            [OUTPUT_TYPE.INFO]: FgBlue,
            [OUTPUT_TYPE.SUCCESS]: FgGreen,
            [OUTPUT_TYPE.ERROR]: FgRed,
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
            this.console.log('', FgWhite);
        });
        done();
    }

    askQuestion(question: string, done: Function) {
        const readlineInterface: Interface = this.readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });

        readlineInterface.question(question, (answer: string) => {
            readlineInterface.close();
            done(null, answer);
        });
    }
}
