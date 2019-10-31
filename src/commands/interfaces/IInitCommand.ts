import Flag from '../Flag';

export default interface IInitCommand {
    initApp(args: string[], done: Function): void;
    ejectApp(path: string, done: Function): void;
    applyConfigOptions(languageType: string, done: Function): void;
    setAppMetadata(appName: string, flags: Flag[], path: string): void;
}
