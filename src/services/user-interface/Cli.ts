import {EOL} from 'os';
import {Interface} from 'readline';
import IUserInterface from '../interfaces/IUserInterface';
import {ERROR, OUTPUT_TYPE} from '../../constants';
import Output from '../../commands/Output';
import {FgBlue, FgGreen, FgRed, FgWhite} from './colors';
import WriteStream = NodeJS.WriteStream;
import {Question} from 'inquirer';

export default class Cli implements IUserInterface {
    private readonly stdout: WriteStream;
    private readonly readline: typeof import('readline');
    private readonly colorsMap: { [type: string]: string };
    private readonly inquirer: typeof import('inquirer');

    constructor(stdout: WriteStream, readline: typeof import('readline'), inquirer: typeof import('inquirer')) {
        this.stdout = stdout;
        this.readline = readline;
        this.colorsMap = {
            [OUTPUT_TYPE.NORMAL]: FgWhite,
            [OUTPUT_TYPE.INFO]: FgBlue,
            [OUTPUT_TYPE.SUCCESS]: FgGreen,
            [OUTPUT_TYPE.ERROR]: FgRed,
        };
        this.inquirer = inquirer;
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

    prompt(questions: Question[], done: Function): void {
        this.inquirer.prompt(questions)
            .then(answers => done(null, answers))
            .catch(err => done(err));
    }
}
