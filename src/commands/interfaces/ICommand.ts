export default interface ICommand {
    execute(done: Function): void;
};
