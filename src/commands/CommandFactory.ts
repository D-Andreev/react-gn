import readline from 'readline';
import ICommand from './interfaces/ICommand';
import {
    ALLOWED_FLAGS,
    ALLOWED_LANGUAGE_TYPE_FLAGS,
    COMMAND, COMMAND_ALIAS,
    COMMAND_FLAG,
    FLAG_INDICATOR,
    FLAGS_MIN_INDEX
} from '../constants';
import TsAppCommand from './init/TsAppCommand';
import UnknownCommand from './UnknownCommand';
import IStorage from '../services/interfaces/IStorage';
import JsAppCommand from './init/JsAppCommand';
import {ICommandFactory} from './interfaces/ICommandFactory';
import Cli from '../user-interface/Cli';
import IUserInterface from '../user-interface/interfaces/IUserInterface';
import ILanguageTypeMap from './interfaces/ILanguageTypeMap';
import Flag from './Flag';
import VersionCommand from './VersionCommand';
import ICra from '../services/interfaces/ICra';
import ComponentCommand from './ComponentCommand';

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

    private static getLanguageTypeFlag(commandArguments: string[], languageTypeMap: ILanguageTypeMap): string {
        const intersection: string[] = commandArguments
            .filter(arg => ALLOWED_LANGUAGE_TYPE_FLAGS.indexOf(arg) !== -1);

        if (intersection && intersection.length > 0 && languageTypeMap.hasOwnProperty(intersection[0])) {
            return intersection[0];
        }

        return COMMAND_FLAG.JS;
    }

    private getCommand(
        commandArguments: string[], languageTypeMap: ILanguageTypeMap, userInterface: IUserInterface
    ): ICommand {
        const appName: string = commandArguments[3];
        const flags: Flag[] = CommandFactory.parseFlags(commandArguments);
        const languageType: string = CommandFactory.getLanguageTypeFlag(commandArguments, languageTypeMap);

        return new languageTypeMap[languageType](
            this.storage, userInterface, this.cra, this.childProcess, appName, flags, process.cwd()
        );
    }

    constructor(storage: IStorage, cra: ICra, childProcess: typeof import('child_process')) {
        this.storage = storage;
        this.cra = cra;
        this.childProcess = childProcess;
    }

    createCommand(commandArguments: string[], done: Function): ICommand {
        const userInterface = new Cli(process.stdout, readline);
        const unknownCommand: ICommand = new UnknownCommand(userInterface);
        let command = unknownCommand;
        commandArguments = CommandFactory.convertAliasesToFullCommand(commandArguments);
        if (!commandArguments.length) {
            return unknownCommand;
        }
        if (commandArguments[2] === COMMAND_FLAG.HELP) {
            command.execute(done);
            return command;
        }
        if (commandArguments[2] === COMMAND_FLAG.VERSION) {
            command = new VersionCommand(this.storage, userInterface);
            command.execute(done);
            return command;
        }

        const languageTypeMap: ILanguageTypeMap = {
            [COMMAND_FLAG.JS]: JsAppCommand,
            [COMMAND_FLAG.TS]: TsAppCommand,
        };

        switch (commandArguments[2]) {
            case COMMAND.INIT:
                if (!commandArguments[3]) {
                    command = unknownCommand;
                } else {
                    command = this.getCommand(commandArguments, languageTypeMap, userInterface);
                }
                break;
            case COMMAND.COMPONENT:
                if (!commandArguments[3]) {
                    command = unknownCommand;
                } else {
                    const flags: Flag[] = CommandFactory.parseFlags(commandArguments, false);
                    command = new ComponentCommand(
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
