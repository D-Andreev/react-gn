import ICommand from './interfaces/ICommand';
import {ALLOWED_FLAGS, COMMAND, COMMAND_FLAG, ERROR} from '../constants';
import TsAppCommand from './TsAppCommand';
import UnknownCommand from './UnknownCommand';
import IStorage from '../services/interfaces/IStorage';
import JsAppCommand from './JsAppCommand';
import {ICommandFactory} from './interfaces/ICommandFactory';

export default class CommandFactory implements ICommandFactory{
    private readonly storage: IStorage;

    constructor(storage: IStorage) {
        this.storage = storage;
    }

    createCommand(commandArguments: string[]): ICommand {
        let command: ICommand = new UnknownCommand();
        if (!commandArguments.length) {
            return command;
        }

        const languageTypeMap = {
            [COMMAND_FLAG.JS]: JsAppCommand,
            [COMMAND_FLAG.TS]: TsAppCommand,
        };
        switch (commandArguments[2]) {
            case COMMAND.INIT:
                if (!commandArguments[3]) {
                    command = new UnknownCommand();
                } else {
                    const appName: string = commandArguments[3];
                    const flags: string[] = commandArguments
                        .filter(arg => ALLOWED_FLAGS.indexOf(arg) !== -1);

                    if (!commandArguments[4] || !languageTypeMap.hasOwnProperty(commandArguments[4])) {
                        command = new JsAppCommand(this.storage, appName, flags);
                    } else {
                        command = new languageTypeMap[commandArguments[4]](this.storage, appName, flags);
                    }
                }
                break;
            default:
                command = new UnknownCommand();
        }

        return command;
    }
}
