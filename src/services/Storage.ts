import IStorage from './interfaces/IStorage';
import ErrnoException = NodeJS.ErrnoException;

export default class Storage implements IStorage {
    private readonly fs: typeof import('fs');

    constructor(fs: typeof import('fs')) {
        this.fs = fs;
    }

    create(path: string, content: string, done: (err: ErrnoException) => {}): void {
        this.fs.writeFile(path, content, done);
    }

    read(path: string, done: (err: ErrnoException) => {}): void {
        this.fs.readFile(path, done);
    }

    update(path: string, content: string, done: (err: ErrnoException) => {}): void {
        this.create(path, content, done);
    }

    delete(path: string, done: (err: ErrnoException) => {}): void {
        this.fs.unlink(path, done);
    }

    directoryExists(path: string, done: (err: ErrnoException) => {}): void {
        this.fs.access(path, done);
    }
}
