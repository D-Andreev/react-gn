export default interface IInitCommand {
    initApp(args: string[], done: Function): void;
    ejectApp(path: string, done: Function): void;
    applyConfigOptions(languageType: string, done: Function): void;
}
