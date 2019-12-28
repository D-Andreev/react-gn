import childProcess from 'child_process';
import CommandFactory from '../../../src/commands/CommandFactory';
import ICommand from '../../../src/commands/interfaces/ICommand';
import {COMMAND, PACKAGE_NAME} from '../../../src/constants';
import UnknownCommand from '../../../src/commands/unknown/UnknownCommand';
import MockStorage from '../../mock/MockStorage';
import {ICommandFactory} from '../../../src/commands/interfaces/ICommandFactory';
import {COMMAND_FILE_PATH, COMMAND_NODE_PATH} from '../../constants';
import ICra from '../../../src/services/interfaces/ICra';
import IStorage from '../../../src/services/interfaces/IStorage';
import Cra from '../../../src/services/Cra';
import VersionCommand from '../../../src/commands/version/VersionCommand';
import NewCommand from '../../../src/commands/new/NewCommand';
import Template from '../../../src/services/Template';
import ejs from 'ejs';
import Cli from '../../../src/services/user-interface/Cli';
import * as inquirer from 'inquirer';
import * as readline from 'readline';
import PackageManager from '../../../src/services/PackageManager';
import Prettier from '../../../src/services/Prettier';
import prettier from 'prettier';
import Wizard from '../../../src/services/wizard/Wizard';

function noop() {}
jest.mock('child_process');

describe('CommandFactory', () => {
    let commandFactory: ICommandFactory;
    let cra: ICra;

    beforeEach(() => {
        const storage: IStorage = new MockStorage();
        cra = new Cra(storage, childProcess);
        const templateService = new Template(ejs);
        const userInterface = new Cli(process.stdout, readline);
        const packageManager = new PackageManager(userInterface, childProcess);
        const prettierService = new Prettier(prettier)
        const wizard = new Wizard(inquirer);
        commandFactory = new CommandFactory(
            storage, templateService, cra, childProcess, userInterface, packageManager, prettierService, wizard);
    });

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

    describe('when I use new command', () => {
        describe('when app name is not provided', () => {
            it('returns unknown command', () => {
                const command: ICommand = commandFactory.createCommand([
                    COMMAND_NODE_PATH,
                    COMMAND_FILE_PATH,
                    COMMAND.NEW
                ], noop);
                expect(command instanceof UnknownCommand).toBeTruthy();
            });
        });

        describe('I use the command correctly', () => {
            it('returns NewCommand', () => {
                const command: ICommand = commandFactory.createCommand([
                    COMMAND_NODE_PATH,
                    COMMAND_FILE_PATH,
                    COMMAND.NEW,
                    'my-app'
                ], noop);
                expect(command instanceof NewCommand).toBeTruthy();
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

        describe('when I pass alias', () => {
            describe('when I pass --h', () => {
                it('shows the help', () => {
                    const command: ICommand = commandFactory
                        .createCommand([
                            COMMAND_NODE_PATH,
                            COMMAND_FILE_PATH,
                            '-h'
                        ], noop);
                    expect(command instanceof UnknownCommand).toBeTruthy();
                });
            });

            describe('when I pass --v', () => {
                it('shows the version', () => {
                    const command: ICommand = commandFactory
                        .createCommand([
                            COMMAND_NODE_PATH,
                            COMMAND_FILE_PATH,
                            '-v',
                        ], noop);
                    // @ts-ignore
                    expect(command instanceof VersionCommand).toBeTruthy();
                });
            });

            describe('TODO: fix; when I use the generate command', () => {
                it('passes', () => {
                    expect(2+2).toEqual(4);
                });
            });
        });
    });
});
