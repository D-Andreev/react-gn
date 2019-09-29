export default interface ICra {
    createApp(name: string, path: string, args?: string[]): void;
    on(event: string, listener: Function): this;
    ejectApp(path: string): void;
}
