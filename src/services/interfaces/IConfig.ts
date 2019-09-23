export default interface IConfig {
    getOptions(done: Function): void;
    getOption(name: string, done: Function): void;
    setOption(name: string, value: string, done: Function): void;
}
