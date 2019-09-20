import Output from '../../commands/Output';

export default interface IUserInterface {
    showOutput(output: Output[], done: Function): void;
}
