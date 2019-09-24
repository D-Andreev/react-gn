export default interface ICra {
    createApp(name: string, path: string): void;
    on(event: string, listener: Function): this;
}
