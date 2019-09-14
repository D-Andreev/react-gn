import ICommand from './interfaces/ICommand';
import {COMMAND, COMMAND_FLAG, ERROR} from '../constants';
import JsAppCommand from './JsAppCommand';
import TsAppCommand from './TsAppCommand';
import UnknownCommand from './UnknownCommand';

export default class CommandFactory {
    static createCommand(commandArguments: Array<string>): ICommand {
        let command: ICommand = null;
        const languageTypes: Array<string> = [COMMAND_FLAG.JS, COMMAND_FLAG.TS];
        const languageTypeMap = {
            [COMMAND_FLAG.JS]: JsAppCommand,
            [COMMAND_FLAG.TS]: TsAppCommand,
        };

        if (!commandArguments.length) {
            throw new Error(ERROR.INVALID_COMMAND);
        }

        switch (commandArguments[1]) {
            case COMMAND.CREATE:
                if (!commandArguments[2]) {
                    throw new Error(ERROR.INVALID_APP_NAME);
                }

                if (!commandArguments[3] ||
                    !languageTypeMap.hasOwnProperty(commandArguments[3]) ||
                    languageTypes.indexOf(commandArguments[3]) === -1) {
                    command = new languageTypeMap[COMMAND_FLAG.JS]();
                } else {
                    command = new languageTypeMap[commandArguments[3]]();
                }
                break;
            default:
                command = new UnknownCommand();
        }

        return command;
    }
}
