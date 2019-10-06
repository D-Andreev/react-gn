export default interface IInitCommand {
    initApp(args: string[], done: Function): void;
    ejectApp(path: string, done: Function): void;
}
