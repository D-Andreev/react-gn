import inquirer from 'inquirer';
import readline from 'readline';
import ICommand from './interfaces/ICommand';
import {
    ALIAS,
    ALLOWED_FLAGS,
    COMMAND, COMMAND_ALIAS,
    COMMAND_FLAG,
    FLAG_INDICATOR,
    FLAGS_MIN_INDEX
} from '../constants';
import UnknownCommand from './UnknownCommand';
import IStorage from '../services/interfaces/IStorage';
import {ICommandFactory} from './interfaces/ICommandFactory';
import Cli from '../user-interface/Cli';
import Flag from './Flag';
import VersionCommand from './VersionCommand';
import ICra from '../services/interfaces/ICra';
import GenerateCommand from './generate/GenerateCommand';
import NewCommand from './new/NewCommand';

export default class CommandFactory implements ICommandFactory{
    private readonly storage: IStorage;
    private readonly cra: ICra;
    public readonly childProcess: typeof import('child_process');

    private static isFlagName(arg: string): boolean {
        return arg.indexOf(FLAG_INDICATOR) !== -1;
    }

    private static isAllowedFlag(input: string): boolean {
        return ALLOWED_FLAGS.indexOf(input) !== -1 && CommandFactory.isFlagName(input);
    }

    private static convertAliasesToFullCommand(commandArguments: string[]): string[] {
        return commandArguments
            .map((arg: string, i: number) => {
                if (i < 2) {
                    return arg;
                }
                if (COMMAND_ALIAS.hasOwnProperty(arg)) {
                    arg = COMMAND_ALIAS[arg];
                }

                return arg;
            });
    }

    private static parseFlags(commandArguments: string[], strict = true): Flag[] {
        const flags: Flag[] = [];
        let currentIndex: number = FLAGS_MIN_INDEX;
        while(currentIndex <= commandArguments.length -1) {
            const input: string = commandArguments[currentIndex];
            if (!strict || CommandFactory.isAllowedFlag(input)) {
                const nextArg: string = commandArguments[currentIndex + 1] || '';
                if (CommandFactory.isFlagName(nextArg)) {
                    flags.push({ name: commandArguments[currentIndex], value: ''});
                } else {
                    flags.push({ name: commandArguments[currentIndex], value: nextArg});
                    currentIndex++;
                }
            }

            currentIndex++;
        }

        return flags;
    }

    private static containsHelpArg(commandArguments: string[]): boolean {
        return commandArguments.includes(COMMAND_FLAG.HELP) ||
            commandArguments.includes(Object.keys(COMMAND_ALIAS).find((alias: string) => alias === ALIAS.HELP));
    }

    constructor(storage: IStorage, cra: ICra, childProcess: typeof import('child_process')) {
        this.storage = storage;
        this.cra = cra;
        this.childProcess = childProcess;
    }

    createCommand(commandArguments: string[], done: Function): ICommand {
        const userInterface = new Cli(process.stdout, readline, inquirer);
        const unknownCommand: ICommand = new UnknownCommand(userInterface);
        let command = unknownCommand;
        commandArguments = CommandFactory.convertAliasesToFullCommand(commandArguments);
        if (!commandArguments.length) {
            return unknownCommand;
        }
        if (CommandFactory.containsHelpArg(commandArguments)) {
            command.execute(done);
            return command;
        }
        if (commandArguments[2] === COMMAND_FLAG.VERSION) {
            command = new VersionCommand(this.storage, userInterface);
            command.execute(done);
            return command;
        }

        switch (commandArguments[2]) {
            case COMMAND.NEW:
                if (!commandArguments[3]) {
                    command = unknownCommand;
                } else {

                    const appName: string = commandArguments[3];
                    const flags: Flag[] = CommandFactory.parseFlags(commandArguments);

                    command = new NewCommand(
                        this.storage, userInterface, this.cra, this.childProcess, appName, flags, process.cwd()
                    );
                }
                break;
            case COMMAND.COMPONENT:
                if (!commandArguments[3]) {
                    command = unknownCommand;
                } else {
                    const flags: Flag[] = CommandFactory.parseFlags(commandArguments, false);
                    command = new GenerateCommand(
                        this.storage,
                        userInterface,
                        this.childProcess,
                        commandArguments[3],
                        flags,
                        process.cwd()
                    );
                }
                break;
            default:
                command = unknownCommand;
        }

        command.execute(done);
        return command;
    }
}
