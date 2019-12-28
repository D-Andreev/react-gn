import {EOL} from 'os';
import {Interface} from 'readline';
import IUserInterface from '../interfaces/IUserInterface';
import {ERROR, OUTPUT_TYPE} from '../../constants';
import Output from '../../lib/Output';
import {FgBlue, FgGreen, FgRed, FgWhite, FgYellow} from './colors';
import WriteStream = NodeJS.WriteStream;

export default class Cli implements IUserInterface {
    private readonly stdout: WriteStream;
    private readonly readline: typeof import('readline');
    private readonly colorsMap: { [type: string]: string };

    constructor(stdout: WriteStream, readline: typeof import('readline')) {
        this.stdout = stdout;
        this.readline = readline;
        this.colorsMap = {
            [OUTPUT_TYPE.NORMAL]: FgWhite,
            [OUTPUT_TYPE.INFO]: FgBlue,
            [OUTPUT_TYPE.SUCCESS]: FgGreen,
            [OUTPUT_TYPE.ERROR]: FgRed,
            [OUTPUT_TYPE.WARN]: FgYellow
        };
    }

    showOutput(output: Output[], done: Function) {
        if (!output || !output.length) {
            done(new Error(ERROR.INVALID_OUTPUT));
        }

        output.forEach((line: Output) => {
            const color: string = this.colorsMap[line.type] || this.colorsMap[OUTPUT_TYPE.NORMAL];
            this.stdout.write(color);
            this.stdout.write(line.contents);
            this.stdout.write(FgWhite);
            this.stdout.write(EOL);
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
