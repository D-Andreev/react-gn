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
import Flag from './Flag';
import VersionCommand from './VersionCommand';
import ICra from '../services/interfaces/ICra';
import GenerateCommand from './generate/GenerateCommand';
import NewCommand from './new/NewCommand';
import ITemplateService from '../services/interfaces/ITemplateService';
import IUserInterface from '../services/interfaces/IUserInterface';
import IPackageManager from '../services/interfaces/IPackageManager';
import IPrettier from '../services/interfaces/IPrettier';
import IWizard from '../services/interfaces/IWizard';

export default class CommandFactory implements ICommandFactory{
    private readonly storage: IStorage;
    private readonly cra: ICra;
    public readonly childProcess: typeof import('child_process');
    private readonly userInterface: IUserInterface;
    private readonly templateService: ITemplateService;
    private readonly packageManager: IPackageManager;
    private readonly prettier: IPrettier;
    private readonly wizard: IWizard;

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

    constructor(
        storage: IStorage,
        templateService: ITemplateService,
        cra: ICra,
        childProcess: typeof import('child_process'),
        userInterface: IUserInterface,
        packageManager: IPackageManager,
        prettier: IPrettier,
        wizard: IWizard) {
        this.storage = storage;
        this.cra = cra;
        this.childProcess = childProcess;
        this.templateService = templateService;
        this.userInterface = userInterface;
        this.packageManager = packageManager;
        this.prettier = prettier;
        this.wizard = wizard;
    }

    createCommand(commandArguments: string[], done: Function): ICommand {
        const unknownCommand: ICommand = new UnknownCommand(this.userInterface);
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
            command = new VersionCommand(this.storage, this.userInterface);
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
                        this.storage,
                        this.userInterface,
                        this.cra,
                        this.childProcess,
                        this.packageManager,
                        this.wizard,
                        appName,
                        flags,
                        process.cwd()
                    );
                }
                break;
            case COMMAND.GENERATE:
                const flags: Flag[] = CommandFactory.parseFlags(commandArguments, false);
                command = new GenerateCommand(
                    this.storage,
                    this.userInterface,
                    this.childProcess,
                    this.templateService,
                    this.packageManager,
                    this.prettier,
                    this.wizard,
                    commandArguments[3],
                    flags,
                    process.cwd()
                );
                break;
            default:
                command = unknownCommand;
        }

        command.execute(done);
        return command;
    }
}
