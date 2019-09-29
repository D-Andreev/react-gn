import readline from 'readline';
import UnknownCommand from '../../../src/commands/UnknownCommand';
import Cli from '../../../src/user-interface/Cli';
import IUserInterface from '../../../src/user-interface/interfaces/IUserInterface';

describe('UnknownCommand', () => {
    let unknownCommand: UnknownCommand;
    let userInterface: IUserInterface;

    beforeEach(() => {
        userInterface = new Cli(console, readline);
        unknownCommand = new UnknownCommand(userInterface);
    });

    describe('execute', () => {
        it('calls showOutput on the user interface with args', (done) => {
            jest.spyOn(userInterface, 'showOutput');
            const cb = () => {
                expect(userInterface.showOutput).toHaveBeenCalled();
                done();
            };
            unknownCommand.execute(cb);
        });
    });
});
