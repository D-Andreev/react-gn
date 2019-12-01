import readline from 'readline';
import VersionCommand from '../../../src/commands/VersionCommand';
import Cli from '../../../src/user-interface/Cli';
import IUserInterface from '../../../src/user-interface/interfaces/IUserInterface';
import MockStorage from '../../mock/MockStorage';
import {OUTPUT_TYPE, PACKAGE_VERSION} from '../../../src/constants';

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
        it('calls showOutput with args', (done) => {
            jest.spyOn(userInterface, 'showOutput');
            const cb = (err: Error) => {
                expect(err).toBeFalsy();
                expect(userInterface.showOutput).toHaveBeenCalledWith([
                    { type: OUTPUT_TYPE.NORMAL, contents: `Version: ${PACKAGE_VERSION}`},
                ], cb);
                done();
            };
            versionCommand.execute(cb);
        });
    });
});
