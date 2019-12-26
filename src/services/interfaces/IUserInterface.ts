import Output from '../../commands/Output';
import {Question} from 'inquirer';

export default interface IUserInterface {
    showOutput(output: Output[], done: Function): void;
    askQuestion(question: string, done: Function): void;
    prompt(question: Question, done: Function): void;
}
