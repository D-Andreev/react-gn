import CommandFactory from '../../../src/commands/CommandFactory';
import ICommand from '../../../src/commands/interfaces/ICommand';
import {COMMAND} from '../../../src/constants';
import JsAppCommand from '../../../src/commands/JsAppCommand';
import TsAppCommand from '../../../src/commands/TsAppCommand';
import UnknownCommand from '../../../src/commands/UnknownCommand';
import MockStorage from '../../mock/MockStorage';
import {ICommandFactory} from '../../../src/commands/interfaces/ICommandFactory';
import {COMMAND_FILE_PATH, COMMAND_NODE_PATH} from '../../constants';

describe('CommandFactory', () => {
    let commandFactory: ICommandFactory;

    beforeEach(() => {
        commandFactory = new CommandFactory(new MockStorage());
    });

    describe('when I use the create command', () => {
        describe('when react-sdk name is not provided', () => {
           it('returns unknown command', () => {
               const command: ICommand = commandFactory.createCommand([]);
               console.log(command)
               expect(command instanceof UnknownCommand).toBeTruthy();
           });
        });

        describe('when command is not provided', () => {
            it('returns unknown command', () => {
                const command: ICommand = commandFactory
                    .createCommand([COMMAND_NODE_PATH, COMMAND_FILE_PATH]);
                expect(command instanceof UnknownCommand).toBeTruthy();
            });
        });

        describe('when main command is unknown', () => {
            it('returns unknown command', () => {
                const command: ICommand = commandFactory
                    .createCommand([COMMAND_NODE_PATH, COMMAND_FILE_PATH, 'invalid-main-command']);
                expect(command instanceof UnknownCommand).toBeTruthy();
            });
        });

        describe('when app name is not provided', () => {
            it('returns unknown command', () => {
                const command: ICommand = commandFactory.createCommand([
                    COMMAND_NODE_PATH,
                    COMMAND_FILE_PATH,
                    COMMAND.INIT
                ]);
                expect(command instanceof UnknownCommand).toBeTruthy();
            });
        });

        describe('when language type is not provided', () => {
            it('returns js type command', () => {
                const command: ICommand = commandFactory
                    .createCommand([
                        COMMAND_NODE_PATH,
                        COMMAND_FILE_PATH,
                        COMMAND.INIT,
                        'test-app'
                    ]);
                expect(command instanceof JsAppCommand).toBeTruthy();
            });
        });

        describe('when js language type is provided', () => {
            it('returns js type command', () => {
                const command: ICommand = commandFactory
                    .createCommand([
                        COMMAND_NODE_PATH,
                        COMMAND_FILE_PATH,
                        COMMAND.INIT,
                        'test-app', '--js'
                    ]);
                expect(command instanceof JsAppCommand).toBeTruthy();
            });
        });

        describe('when ts language type is provided', () => {
            it('returns ts type command', () => {
                const command: ICommand = commandFactory
                    .createCommand([
                        COMMAND_NODE_PATH,
                        COMMAND_FILE_PATH,
                        COMMAND.INIT,
                        'test-app',
                        '--ts'
                    ]);
                expect(command instanceof TsAppCommand).toBeTruthy();
            });
        });
    });
});
