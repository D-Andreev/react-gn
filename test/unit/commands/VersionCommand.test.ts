import readline from 'readline';
import VersionCommand from '../../../src/commands/VersionCommand';
import Cli from '../../../src/user-interface/Cli';
import IUserInterface from '../../../src/user-interface/interfaces/IUserInterface';
import MockStorage from '../../mock/MockStorage';
import {OUTPUT_TYPE} from '../../../src/constants';

describe('VersionCommand', () => {
    let versionCommand: VersionCommand;
    let userInterface: IUserInterface;
    let mockStorage: any;
    let stdout: any;

    beforeEach(() => {
        stdout = process.stdout;
        stdout.write = jest.fn();
        userInterface = new Cli(stdout, readline);
        mockStorage = new MockStorage();
        versionCommand = new VersionCommand(mockStorage, userInterface);
    });

    describe('execute', () => {
        describe('when package.json is not found', () => {
            it('yields error', (done) => {
                const error = new Error('Invalid package.json path');
                mockStorage.read = jest.fn((path: string, done) => {
                    done(new Error('Invalid package.json path'));
                });
                const cb = (err: Error) => {
                    expect(mockStorage.read.mock.calls[0][0]).toEqual('./package.json');
                    expect(err).toEqual(error);
                    done();
                };
                versionCommand.execute(cb);
            });
        });

        describe('when package.json contents are not available', () => {
            it('yields error', (done) => {
                const error = new Error('package.json file not found');
                mockStorage.read = jest.fn((path: string, done) => {
                    done(null);
                });
                const cb = (err: Error) => {
                    expect(mockStorage.read.mock.calls[0][0]).toEqual('./package.json');
                    expect(err).toEqual(error);
                    done();
                };
                versionCommand.execute(cb);
            });
        });

        describe('when package.json can not be parsed', () => {
            it('yields error', (done) => {
                const error = new Error('Could not parse package.json');
                mockStorage.read = jest.fn((path: string, done) => {
                    done(null, 'invalid-json');
                });
                const cb = (err: Error) => {
                    expect(mockStorage.read.mock.calls[0][0]).toEqual('./package.json');
                    expect(err).toEqual(error);
                    done();
                };
                versionCommand.execute(cb);
            });
        });

        describe('when package.json is valid', () => {
            it('calls showOutput with args', (done) => {
                jest.spyOn(userInterface, 'showOutput');
                mockStorage.read = jest.fn((path: string, done) => {
                    done(null, '{"version": "1.0.0"}');
                });
                const cb = (err: Error) => {
                    expect(mockStorage.read.mock.calls[0][0]).toEqual('./package.json');
                    expect(err).toBeFalsy();
                    expect(userInterface.showOutput).toHaveBeenCalledWith([
                        { type: OUTPUT_TYPE.NORMAL, contents: 'Version: 1.0.0'},
                    ], cb);
                    done();
                };
                versionCommand.execute(cb);
            });
        });
    });
});
