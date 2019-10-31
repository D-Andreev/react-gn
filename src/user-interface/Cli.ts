import {EOL} from 'os';
import {Interface} from 'readline';
import IUserInterface from './interfaces/IUserInterface';
import {ERROR, OUTPUT_TYPE} from '../constants';
import Output from '../commands/Output';
import {FgBlue, FgGreen, FgRed, FgWhite} from './colors';
import WriteStream = NodeJS.WriteStream;
import {inject, injectable} from 'tsyringe';

@injectable()
export default class Cli implements IUserInterface {
    private readonly colorsMap: { [type: string]: string };

    constructor(@inject('stdout') private readonly stdout: WriteStream,
                @inject('readline') private readonly readline: typeof import('readline')) {
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
