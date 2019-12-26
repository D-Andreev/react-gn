import Output from '../../lib/Output';

export default interface IUserInterface {
    showOutput(output: Output[], done: Function): void;
    askQuestion(question: string, done: Function): void;
}
