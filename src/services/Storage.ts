import {Stats} from 'fs';
import IStorage from './interfaces/IStorage';
import ErrnoException = NodeJS.ErrnoException;

export default class Storage implements IStorage {
    private readonly fs: typeof import('fs');
    private readonly path: typeof import('path');

    private walk(path: string, done: Function) {
        let results: string[] = [];
        this.fs.readdir(path, (err: Error, list: string[]) => {
            if (err) {
                return done(err);
            }
            let pending: number = list.length;
            if (!pending) {
                return done(null, results);
            }
            list.forEach((file: string) => {
                file = this.path.resolve(path, file);

                this.fs.stat(file, (err: Error, stat: Stats) => {
                    if (stat && stat.isDirectory()) {
                        this.walk(file, (err: Error, res: string[]) => {
                            results = results.concat(res);
                            if (!--pending) {
                                done(null, results);
                            }
                        });
                    } else {
                        results.push(file);
                        if (!--pending) {
                            done(null, results);
                        }
                    }
                });
            });
        });
    };

    constructor(fs: typeof import('fs'), path: typeof import('path')) {
        this.fs = fs;
        this.path = path;
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

    scanDirectory(path: string, done: Function): void {
        this.directoryExists(path, (err: ErrnoException) => {
            if (err) {
                return done(err);
            }
            this.walk(path, done);
        });
    }
}
