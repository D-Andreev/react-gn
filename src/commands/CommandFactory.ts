import ICommand from './interfaces/ICommand';
import {
    ALLOWED_FLAGS,
    ALLOWED_LANGUAGE_TYPE_FLAGS,
    COMMAND,
    COMMAND_FLAG,
    FLAG_INDICATOR,
    FLAGS_MIN_INDEX
} from '../constants';
import IStorage from '../services/interfaces/IStorage';
import {ICommandFactory} from './interfaces/ICommandFactory';
import ILanguageTypeMap from './interfaces/ILanguageTypeMap';
import Flag from './Flag';
import ICra from '../services/interfaces/ICra';
import {container} from 'tsyringe';

export default class CommandFactory implements ICommandFactory{
    private readonly storage: IStorage;
    private readonly cra: ICra;
    public readonly childProcess: typeof import('child_process');

    private static isFlagName(arg: string): boolean {
        return arg.indexOf(FLAG_INDICATOR) !== -1;
    }

    private static parseFlags(commandArguments: string[]): Flag[] {
        const flags: Flag[] = [];
        let currentIndex: number = FLAGS_MIN_INDEX;

        while(currentIndex <= commandArguments.length) {
            const input: string = commandArguments[currentIndex];
            if (ALLOWED_FLAGS.indexOf(input) !== -1 && CommandFactory.isFlagName(input)) {
                const nextArg: string = commandArguments[currentIndex + 1] || '';
                if (CommandFactory.isFlagName(nextArg)) {
                    flags.push({ name: commandArguments[currentIndex], value: ''});
                } else {
                    flags.push({ name: commandArguments[currentIndex], value: nextArg});
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

    private getInitCommand(commandArguments: string[], languageTypeMap: ILanguageTypeMap): ICommand {
        const appName: string = commandArguments[3];
        const flags: Flag[] = CommandFactory.parseFlags(commandArguments);
        const languageType: string = CommandFactory.getLanguageTypeFlag(commandArguments, languageTypeMap);

        const command: ICommand = container.resolve(languageTypeMap[languageType]);
        command.setAppMetadata(appName, flags, process.cwd());
        return command;
    }

    createCommand(commandArguments: string[], done: Function): ICommand {
        const unknownCommand: ICommand = container.resolve('UnknownCommand');
        let command = unknownCommand;

        if (!commandArguments.length) {
            return unknownCommand;
        }
        if (commandArguments[2] === COMMAND_FLAG.HELP) {
            command.execute(done);
            return command;
        }
        if (commandArguments[2] === COMMAND_FLAG.VERSION) {
            command = container.resolve('VersionCommand');
            command.execute(done);
            return command;
        }

        const languageTypeMap: ILanguageTypeMap = {
            [COMMAND_FLAG.JS]: 'JsAppCommand',
            [COMMAND_FLAG.TS]: 'TsAppCommand',
        };

        switch (commandArguments[2]) {
            case COMMAND.INIT:
                if (!commandArguments[3]) {
                    command = unknownCommand;
                } else {
                    command = this.getInitCommand(commandArguments, languageTypeMap);
                }
                break;
            default:
                command = unknownCommand;
        }

        command.execute(done);
        return command;
    }
}
