export default interface ICra {
    createApp(name: string, path: string, args?: string[]): void;
    on(event: string, listener: Function): this;
    emit(event: string, ...args: any[]): boolean;
    ejectApp(path: string): void;
}
