import {Stats} from 'fs';
import IStorage from './interfaces/IStorage';
import ErrnoException = NodeJS.ErrnoException;
import {sep} from 'path';

export default class Storage implements IStorage {
    private readonly fs: typeof import('fs');
    private readonly path: typeof import('path');

    private walk(path: string, done: Function) {
        let results: string[] = [];
        this.fs.readdir(path, (err: ErrnoException | null, list: string[]) => {
            if (err) {
                return done(err);
            }
            let pending: number = list.length;
            if (!pending) {
                return done(null, results);
            }
            list.forEach((file: string) => {
                file = this.path.resolve(path, file);

                this.fs.stat(file, (err: ErrnoException | null, stat: Stats) => {
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

    public createFolderIfNotExists(folderPath: string): void {
        if (!this.fs.existsSync(folderPath)) {
            this.fs.mkdirSync(folderPath);
        }
    }

    private getCurrentFolderPath(splitPath: string[], i: number): string {
        let folder = '';
        if (i === 0) {
            folder = splitPath[i];
        } else {
            folder = splitPath.slice(0, i + 1).join(this.path.sep);
        }

        return folder;
    }

    private static getSplitPaths(paths: string[]): string[][] {
        return paths
            .map((path: string) => path.split(sep))
            .filter((splitPath: string[]) => splitPath.length > 1);
    }

    constructor(fs: typeof import('fs'), path: typeof import('path')) {
        this.fs = fs;
        this.path = path;
    }

    create(path: string, content: string, done: (err: ErrnoException | null) => {}): void {
        this.fs.writeFile(path, content, done);
    }

    read(path: string, done: (err: ErrnoException | null) => {}): void {
        this.fs.readFile(path, done);
    }

    update(path: string, content: string, done: (err: ErrnoException | null) => {}): void {
        this.create(path, content, done);
    }

    delete(path: string, done: (err: ErrnoException | null) => {}): void {
        this.fs.unlink(path, done);
    }

    directoryExists(path: string, done: (err: ErrnoException | null) => {}): void {
        this.fs.access(path, done);
    }

    scanDirectory(path: string, done: Function): void {
        this.directoryExists(path, (err: ErrnoException | null) => {
            if (err) {
                return done(err);
            }
            this.walk(path, done);
        });
    }

    createPaths(mainPath: string, paths: string[], done: Function): void {
        if (!paths || !paths.length) {
            return done();
        }

        const splitPaths: string[][] = Storage.getSplitPaths(paths);
        const checkedPaths: {[key: string]: boolean} = {};
        for (let i = 0; i < splitPaths.length; i++) {
            const splitPath: string[] = splitPaths[i];
            for (let j = 0; j < splitPath.length - 1; j++) {
                const folder = this.getCurrentFolderPath(splitPath, j);
                const folderPath: string = this.path.join(mainPath, folder);
                if (checkedPaths.hasOwnProperty(folderPath)) {
                    continue;
                }
                try {
                    this.createFolderIfNotExists(folderPath);
                    checkedPaths[folderPath] = true;
                } catch (e) {
                    return done(e);
                }
            }
        }

        done();
    }

    generateFilePath(parts: string[], done: Function): void {
        done(null, this.path.join(...parts));
    }

    createDirectory(path: string, done: Function): void {
        this.fs.mkdir(path, (err: ErrnoException) => done(err));
    }
}
