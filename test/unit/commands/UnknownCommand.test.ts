import UnknownCommand from '../../../src/commands/UnknownCommand';
import Cli from '../../../src/user-interface/Cli';
import IUserInterface from '../../../src/user-interface/interfaces/IUserInterface';
import {
    ALLOWED_FLAGS_DESCRIPTIONS,
    ASCII_ART,
    MAIN_COMMANDS,
    MAIN_COMMANDS_DESCRIPTIONS,
    OUTPUT_TYPE
} from '../../../src/constants';

jest.mock('fs');

describe('UnknownCommand', () => {
    let unknownCommand: UnknownCommand;
    let userInterface: IUserInterface;

    beforeEach(() => {
        userInterface = new Cli(console);
        unknownCommand = new UnknownCommand(userInterface);
    });

    describe('execute', () => {
        it('calls showOutput on the user interface with args', (done) => {
            jest.spyOn(userInterface, 'showOutput');
            const cb = () => {
                expect(userInterface.showOutput).toHaveBeenCalledWith([
                    {type: OUTPUT_TYPE.INFO, contents: ASCII_ART.HELP},
                    {type: OUTPUT_TYPE.SUCCESS, contents: 'Main commands: '},
                    {
                        type: OUTPUT_TYPE.NORMAL,
                        contents:
                            `${' '.repeat(8)}${MAIN_COMMANDS[0]} - ${MAIN_COMMANDS_DESCRIPTIONS[MAIN_COMMANDS[0]]}`,
                    },
                    {
                        type: OUTPUT_TYPE.NORMAL,
                        contents:
                            `${' '.repeat(8)}${MAIN_COMMANDS[1]} - ${MAIN_COMMANDS_DESCRIPTIONS[MAIN_COMMANDS[1]]}`,
                    },
                    {type: OUTPUT_TYPE.SUCCESS, contents: 'Options: '},
                    {
                        type: OUTPUT_TYPE.NORMAL,
                        contents: `${' '.repeat(8)}${'--js'} - ${ALLOWED_FLAGS_DESCRIPTIONS['--js']}`
                    }
                    ,
                    {
                        type: OUTPUT_TYPE.NORMAL,
                        contents: `${' '.repeat(8)}${'--ts'} - ${ALLOWED_FLAGS_DESCRIPTIONS['--ts']}`
                    }
                    ,
                    {
                        type: OUTPUT_TYPE.NORMAL,
                        contents: `${' '.repeat(8)}${'--config'} - ${ALLOWED_FLAGS_DESCRIPTIONS['--config']}`
                    }
                ], cb);
                done();
            };
            unknownCommand.execute(cb);
        });
    });
});
