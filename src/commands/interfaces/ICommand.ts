import Flag from '../Flag';

export default interface ICommand {
    execute(done: Function): void;
    setAppMetadata(appName: string, flags: Flag[], path: string): void;
};
