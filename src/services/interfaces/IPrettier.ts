export default interface IPrettier {
    prettify(code: string, done: Function): void;
}