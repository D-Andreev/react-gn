import ICommand from './interfaces/ICommand';
import {
    ALIAS,
    ALLOWED_FLAGS,
    COMMAND,
    COMMAND_ALIAS,
    COMMAND_FLAG,
    FLAG_INDICATOR,
    FLAGS_MIN_INDEX, MAIN_COMMAND_ALIAS
} from '../constants';
import HelpCommand from './help/HelpCommand';
import IStorage from '../services/interfaces/IStorage';
import {ICommandFactory} from './interfaces/ICommandFactory';
import Flag from '../lib/Flag';
import VersionCommand from './version/VersionCommand';
import ICra from '../services/interfaces/ICra';
import GenerateCommand from './generate/GenerateCommand';
import NewCommand from './new/NewCommand';
import ITemplateService from '../services/interfaces/ITemplateService';
import IUserInterface from '../services/interfaces/IUserInterface';
import IPackageManager from '../services/interfaces/IPackageManager';
import IPrettier from '../services/interfaces/IPrettier';
import IWizard from '../services/interfaces/IWizard';
import TemplateCommand from './template/TemplateCommand';
import UnknownCommand from './unknown/Unknown';

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

    private getCommandAlias(command: string): string {
        return Object.keys(COMMAND_ALIAS).find((alias: string) => alias === command);
    }

    private containsHelpArg(commandArguments: string[]): boolean {
        return commandArguments.includes(COMMAND_FLAG.HELP) ||
            commandArguments.includes(this.getCommandAlias(COMMAND_FLAG.HELP));
    }

    createCommand(commandArguments: string[], done: Function): ICommand {
        const helpCommand: ICommand = new HelpCommand(this.userInterface);
        let command = helpCommand;
        commandArguments = CommandFactory.convertAliasesToFullCommand(commandArguments);
        if (!commandArguments.length || commandArguments.length < 3) {
            helpCommand.execute(done);
            return command;
        }
        if (this.containsHelpArg(commandArguments)) {
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
            case MAIN_COMMAND_ALIAS[COMMAND.NEW]:
                if (!commandArguments[3]) {
                    command = helpCommand;
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
            case MAIN_COMMAND_ALIAS[COMMAND.GENERATE]:
                command = new GenerateCommand(
                    this.storage,
                    this.userInterface,
                    this.childProcess,
                    this.templateService,
                    this.prettier,
                    this.wizard,
                    CommandFactory.parseFlags(commandArguments, false),
                );
                break;
            case COMMAND.TEMPLATE:
            case MAIN_COMMAND_ALIAS[COMMAND.TEMPLATE]:
                command = new TemplateCommand(
                    this.storage,
                    this.userInterface,
                    this.childProcess,
                    this.templateService,
                    this.prettier,
                    this.wizard,
                    CommandFactory.parseFlags(commandArguments, false),
                );
                break;
            default:
                command = new UnknownCommand(this.userInterface, commandArguments[2]);
        }

        command.execute(done);
        return command;
    }
}
