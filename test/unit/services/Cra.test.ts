import childProcess from 'child_process';
import {EventEmitter} from 'events';
import Cra from '../../../src/services/Cra';
import ICra from '../../../src/services/interfaces/ICra';
import MockStorage from '../../mock/MockStorage';
import {CRA_EVENT} from '../../../src/constants';
import IStorage from '../../../src/services/interfaces/IStorage';

jest.mock('child_process');

describe('Cra', () => {
    let cra: ICra;
    let storage: IStorage;
    let spawn: any;

    beforeEach(() => {
        storage = new MockStorage();
        spawn = jest.fn(() => {
            class MockSpawn extends EventEmitter {
                stderr: any;
                stdout: any;

                constructor() {
                    super();
                    this.stderr = process.stderr;
                    this.stderr.setEncoding = () => {};
                    this.stdout = process.stderr;
                    this.stdout.setEncoding = () => {};
                }
            }

            return new MockSpawn();
        });
        childProcess.spawn = spawn;
        cra = new Cra(storage, childProcess);
    });

    describe('createApp', () => {
        describe('when target dir does not exists', () => {
            it('yields error', (done) => {
                storage.directoryExists = jest.fn((path: string, cb: Function) => {
                    cb(new Error('not found'));
                });
                cra.on(CRA_EVENT.INIT_ERROR, (err: any) => {
                    expect(err.message).toEqual('not found');
                    done();
                });
                cra.createApp('test', './invalid-path');
            });
        });

        describe('when target dir exists', () => {
            beforeEach(() => {
                storage.directoryExists = jest.fn((path: string, cb: Function) => {
                    cb();
                });
            });

            describe('when arguments are empty', () => {
                it('executes the command with arguments', (done) => {
                    cra.createApp('test', './');
                    const expectedCommand = 'cd ./ && create-react-app';
                    const args = ['test'];
                    expect(childProcess.spawn).toHaveBeenCalledWith(expectedCommand, args, {shell: true});
                    done();
                });
            });

            describe('when arguments are not empty', () => {
                it('executes the command with arguments', (done) => {
                    cra.createApp('test', './', ['--typescript']);
                    const expectedCommand = 'cd ./ && create-react-app';
                    const args = ['test', '--typescript'];
                    expect(childProcess.spawn).toHaveBeenCalledWith(expectedCommand, args, {shell: true});
                    done();
                });
            });
        });
    });

    describe('ejectApp', () => {
        describe('when path is not valid', () => {
            beforeEach(() => {
                storage.directoryExists = jest.fn((path: string, cb: Function) => {
                    cb(new Error('not found'));
                });
            });

            it('yields error', (done) => {
                cra.on(CRA_EVENT.EJECT_ERROR, (err: any) => {
                    expect(err.message).toEqual('not found');
                    done();
                });
                cra.ejectApp('./invalid-path');
            });
        });

        describe('when path is valid', () => {
            beforeEach(() => {
                storage.directoryExists = jest.fn((path: string, cb: Function) => {
                    cb();
                });
            });

            it('executes the command', (done) => {
                cra.ejectApp('./path/to/app');
                const expectedCommand = 'cd ./path/to/app && npm run eject';
                const args = ['-y'];
                expect(childProcess.spawn).toHaveBeenCalledWith(expectedCommand, args, {shell: true});
                done();
            });
        });
    });
});
