import fs from 'fs';
import path from 'path';
import Storage from '../../../src/services/Storage';
import IStorage from '../../../src/services/interfaces/IStorage';

jest.mock('fs');
jest.mock('path');

describe('Storage', () => {
    let storage: IStorage;

    beforeEach(() => {
        storage = new Storage(fs, path);
        // @ts-ignore
        fs.writeFile = jest.fn((path: string, content: string, cb: any) => {
            cb(null);
        });
        // @ts-ignore
        fs.unlink = jest.fn((path: string, cb: any) => {
            cb(null);
        });
        // @ts-ignore
        fs.readFile = jest.fn((path: string, cb: any) => {
            cb(null);
        });
        // @ts-ignore
        fs.access = jest.fn((path: string, cb: any) => {
            cb(null);
        });
        // @ts-ignore
        fs.mkdirSync = jest.fn((path: string, cb: any) => {
            cb(null);
        });
        // @ts-ignore
        fs.existsSync = jest.fn((path: string, cb: any) => {
            cb(null);
        });
    });

    describe('create', () => {
        it('calls fs function with args', (done) => {
            const cb = () => {
                expect(fs.writeFile).toHaveBeenCalledWith('./path/to/file', '', cb);
                done();
            };
            storage.create('./path/to/file', '', cb);
        });
    });

    describe('read', () => {
        it('calls fs function with args', (done) => {
            const cb = () => {
                expect(fs.readFile).toHaveBeenCalledWith('./path/to/file', cb);
                done();
            };
            storage.read('./path/to/file', cb);
        });
    });

    describe('update', () => {
        it('calls fs function with args', (done) => {
            const cb = () => {
                expect(fs.writeFile).toHaveBeenCalledWith('./path/to/file', '', cb);
                done();
            };
            storage.update('./path/to/file', '', cb);
        });
    });

    describe('delete', () => {
        it('calls fs function with args', (done) => {
            const cb = () => {
                expect(fs.unlink).toHaveBeenCalledWith('./path/to/file', cb);
                done();
            };
            storage.delete('./path/to/file', cb);
        });
    });

    describe('directoryExists', () => {
        it('calls fs function with args', (done) => {
            const cb = () => {
                expect(fs.access).toHaveBeenCalledWith('./path/to/file', cb);
                done();
            };
            storage.directoryExists('./path/to/file', cb);
        });
    });

    describe('scanDirectory', () => {
        describe('when path is not valid', () => {
            it('yields error', (done) => {
                // @ts-ignore
                fs.access = jest.fn((path: string, done: any) => done(new Error('err')));
                const cb = (err: Error) => {
                    expect(err instanceof Error).toBeTruthy();
                    done();
                };
                storage.directoryExists('./invalid-path', cb);
            });
        });

        describe('when path is valid', () => {
            describe('when readdir returns error', () => {
                beforeEach(() => {
                    storage.directoryExists = jest.fn((path: string, done: any) => done());
                });

                it('yields error', (done) => {
                    // @ts-ignore
                    fs.readdir = jest.fn((dir: string, cb: any) => {
                        return cb(new Error('error'));
                    });

                    storage.scanDirectory('./valid-path', (err: any) => {
                        expect(err instanceof Error).toBeTruthy();
                        done();
                    });
                });
            });

            describe('when file list is empty', () => {
                it('yields empty array', (done) => {
                    // @ts-ignore
                    fs.readdir = jest.fn((dir: string, cb: any) => {
                        return cb(null, []);
                    });

                    storage.scanDirectory('./valid-path', (err: any, res: any) => {
                        expect(err).toBeFalsy();
                        expect(res).toEqual([]);
                        done();
                    });
                });
            });

            describe('when directory contains files or directories', () => {
                beforeEach(() => {
                    // @ts-ignore
                    fs.readdir = jest.fn((path: string, done: any) => done(null, [
                        './path/',
                        './path/dir1',
                        './path/dir2',
                    ]));
                });

                describe('when directory contains only files', () => {
                    it('returns sorted array of file paths', (done) => {
                        // @ts-ignore
                        fs.stat = jest.fn((path: string, done: any) =>
                            done(null, {isDirectory: jest.fn(() => false)}));
                        path.resolve = jest.fn(() => './path/dir1');
                        const cb = (err: Error, res: any) => {
                            expect(err).toBeFalsy();
                            expect(res).toEqual(['./path/dir1', './path/dir1', './path/dir1']);
                            done();
                        };
                        storage.scanDirectory('./valid-path', cb);
                    });
                });

                describe('when directory contains only files', () => {
                    it('returns sorted array of file paths', (done) => {
                        // @ts-ignore
                        fs.stat = jest.fn((path: string, done: any) =>
                            done(null, {isDirectory: jest.fn(() => {
                                    return path === './path/dir2';
                                })}));
                        path.resolve = jest.fn(() => './path/dir1');
                        const cb = (err: Error, res: any) => {
                            expect(err).toBeFalsy();
                            expect(res).toEqual(['./path/dir1', './path/dir1', './path/dir1']);
                            done();
                        };
                        storage.scanDirectory('./valid-path', cb);
                    });
                });
            });
        });
    });

    describe('createPaths', () => {
        let paths: string[];
        let mainPath: string;

        beforeEach(() => {
            mainPath = './path/to/app/';
            paths = [
                'src/App',
                'index',
                'src/reducers/rootReducer',
                'src/actions/simpleAction',
                'src/reducers/simpleReducer',
                'src/components/MyComponent'
            ];
            // @ts-ignore
            path.join = require.requireActual('path').join;
            // @ts-ignore
            path.sep = require.requireActual('path').sep;
        });

        describe('when paths is an empty array', () => {
            it('calls the callback with no error', (done) => {
                const cb = () => {
                    expect(fs.mkdirSync).not.toHaveBeenCalled();
                    done();
                };
                storage.createPaths(mainPath, [], cb);
            });
        });

        describe('when paths is not empty', () => {
            it('checks if the paths exist', (done) => {
                // @ts-ignore
                fs.existsSync = jest.fn(() => true);
                const cb = () => {
                    const expectedPaths: string[] = [
                        'src',
                        'src/reducers',
                        'src/actions',
                        'src/components'
                    ];
                    expectedPaths.forEach((currentPath: string, i: number) => {
                        expect(fs.existsSync).toHaveBeenCalledTimes(expectedPaths.length);
                        expect(fs.existsSync)
                            .toHaveBeenNthCalledWith(i + 1, path.join(mainPath, currentPath));
                    });
                    done();
                };
                storage.createPaths(mainPath, paths, cb);
            });

            describe('when a folder does not exist', () => {
                beforeEach(() => {
                    // @ts-ignore
                    fs.existsSync = jest.fn((folderPath: string) => {
                        if (folderPath === path.join(mainPath, 'src/reducers')) {
                            return false;
                        }

                        return true;
                     });
                });

                it('creates the folder', (done) => {
                    const cb = () => {
                        expect(fs.mkdirSync).toHaveBeenCalledTimes(1);
                        expect(fs.mkdirSync).toHaveBeenCalledWith(path.join(mainPath, 'src/reducers'));
                        done();
                    };
                    storage.createPaths(mainPath, paths, cb);
                });
            });
        });
    });
});
