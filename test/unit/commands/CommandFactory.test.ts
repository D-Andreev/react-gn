import childProcess from 'child_process';
import CommandFactory from '../../../src/commands/CommandFactory';
import ICommand from '../../../src/commands/interfaces/ICommand';
import {COMMAND, PACKAGE_NAME} from '../../../src/constants';
import JsAppCommand from '../../../src/commands/init/JsAppCommand';
import TsAppCommand from '../../../src/commands/init/TsAppCommand';
import UnknownCommand from '../../../src/commands/UnknownCommand';
import MockStorage from '../../mock/MockStorage';
import {ICommandFactory} from '../../../src/commands/interfaces/ICommandFactory';
import {COMMAND_FILE_PATH, COMMAND_NODE_PATH} from '../../constants';
import ICra from '../../../src/services/interfaces/ICra';
import IStorage from '../../../src/services/interfaces/IStorage';
import Cra from '../../../src/services/Cra';

function noop() {}
jest.mock('child_process');

describe('CommandFactory', () => {
    let commandFactory: ICommandFactory;
    let cra: ICra;

    beforeEach(() => {
        const storage: IStorage = new MockStorage();
        cra = new Cra(storage, childProcess);
        commandFactory = new CommandFactory(storage, cra, childProcess);
    });

    describe('when I use the create command', () => {
        describe(`when ${PACKAGE_NAME} name is not provided`, () => {
           it('returns unknown command', () => {
               const command: ICommand = commandFactory.createCommand([], noop);
               expect(command instanceof UnknownCommand).toBeTruthy();
           });
        });

        describe('when command is not provided', () => {
            it('returns unknown command', () => {
                const command: ICommand = commandFactory
                    .createCommand([COMMAND_NODE_PATH, COMMAND_FILE_PATH], noop);
                expect(command instanceof UnknownCommand).toBeTruthy();
            });
        });

        describe('when main command is unknown', () => {
            it('returns unknown command', () => {
                const command: ICommand = commandFactory
                    .createCommand(
                        [COMMAND_NODE_PATH, COMMAND_FILE_PATH, 'invalid-main-command'], noop);
                expect(command instanceof UnknownCommand).toBeTruthy();
            });
        });

        describe('when app name is not provided', () => {
            it('returns unknown command', () => {
                const command: ICommand = commandFactory.createCommand([
                    COMMAND_NODE_PATH,
                    COMMAND_FILE_PATH,
                    COMMAND.INIT
                ], noop);
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
                    ], noop);
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
                    ], noop);
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
                    ], noop);
                expect(command instanceof TsAppCommand).toBeTruthy();
            });
        });

        describe('when unknown flags are passed', () => {
            it('omits the unknown flags', () => {
                const command: ICommand = commandFactory
                    .createCommand([
                        COMMAND_NODE_PATH,
                        COMMAND_FILE_PATH,
                        COMMAND.INIT,
                        'test-app',
                        '--unknown-flag',
                        'some-value'
                    ], noop);
                // @ts-ignore
                expect(command.flags).toEqual([]);
            });
        });

        describe('when unknown flags are mixed with valid flags', () => {
            it('omits the unknown flags', () => {
                const command: ICommand = commandFactory
                    .createCommand([
                        COMMAND_NODE_PATH,
                        COMMAND_FILE_PATH,
                        COMMAND.INIT,
                        'test-app',
                        '--ts',
                        '--unknown-flag',
                        'some-value',
                        'some-other-value',
                        '--other-unknown-flag'
                    ], noop);
                // @ts-ignore
                expect(command.flags).toEqual([{name: '--ts', value: ''}]);
            });
        });

        describe('when I pass config flag with no file path', () => {
            it('sets the flag with no value', () => {
                const command: ICommand = commandFactory
                    .createCommand([
                        COMMAND_NODE_PATH,
                        COMMAND_FILE_PATH,
                        COMMAND.INIT,
                        'test-app',
                        '--ts',
                        '--unknown-flag',
                        'some-value',
                        'some-other-value',
                        '--other-unknown-flag',
                        '--config'
                    ], noop);
                // @ts-ignore
                expect(command.flags).toEqual([{name: '--ts', value: ''}, {name: '--config', value: ''}]);
            });
        });

        describe('when I pass config flag with file path', () => {
            it('sets the flag with no value', () => {
                const command: ICommand = commandFactory
                    .createCommand([
                        COMMAND_NODE_PATH,
                        COMMAND_FILE_PATH,
                        COMMAND.INIT,
                        'test-app',
                        '--ts',
                        '--unknown-flag',
                        'some-value',
                        'some-other-value',
                        '--other-unknown-flag',
                        '--config',
                        './path/to/config',
                    ], noop);
                // @ts-ignore
                expect(command.flags).toEqual([
                    {name: '--ts', value: ''},
                    {name: '--config', value: './path/to/config'}
                ]);
            });
        });

        describe('when I pass --help', () => {
            it('shows the help', () => {
                const command: ICommand = commandFactory
                    .createCommand([
                        COMMAND_NODE_PATH,
                        COMMAND_FILE_PATH,
                        '--help'
                    ], noop);
                expect(command instanceof UnknownCommand).toBeTruthy();
            });
        });

        describe('when I pass main command and then --help', () => {
            it('executes only main command', () => {
                const command: ICommand = commandFactory
                    .createCommand([
                        COMMAND_NODE_PATH,
                        COMMAND_FILE_PATH,
                        COMMAND.INIT,
                        'myApp',
                        '--ts',
                        '--help'
                    ], noop);
                expect(command instanceof TsAppCommand).toBeTruthy();
            });
        });
    });
});
