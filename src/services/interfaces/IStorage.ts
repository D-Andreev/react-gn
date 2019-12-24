export default interface IStorage {
    create(path: string, content: string, done: Function): void;
    read(path: string, done: Function): void;
    update(path: string, content: string, done: Function): void;
    delete(path: string, done: Function): void;
    directoryExists(path: string, done: Function): void;
    scanDirectory(path: string, done: Function): void;
    createPaths(mainPath: string, paths: string[], done: Function): void;
    generateFilePath(parts: string[], done: Function): void;
    createDirectory(path: string, done: Function): void;
}
