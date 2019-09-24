import fs from 'fs';
import Storage from '../../../src/services/Storage';
import IStorage from '../../../src/services/interfaces/IStorage';

jest.mock('fs');

describe('Storage', () => {
    let storage: IStorage;

    beforeEach(() => {
        storage = new Storage(fs);
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
});
