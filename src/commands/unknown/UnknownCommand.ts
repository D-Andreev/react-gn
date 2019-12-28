import ICommand from '../interfaces/ICommand';
import IUserInterface from '../../services/interfaces/IUserInterface';
import {
    ALLOWED_FLAGS,
    ALLOWED_FLAGS_DESCRIPTIONS,
    ASCII_ART,
    MAIN_COMMANDS,
    MAIN_COMMANDS_DESCRIPTIONS,
    OUTPUT_TYPE
} from '../../constants';
import Output from '../../lib/Output';

export default class UnknownCommand implements ICommand {
    private readonly userInterface: IUserInterface;

    constructor(userInterface: IUserInterface) {
        this.userInterface = userInterface;
    }

    execute(done: Function): void {
        const output: Output[] = [
            { type: OUTPUT_TYPE.INFO, contents: ASCII_ART.HELP },
        ];

        output.push({type: OUTPUT_TYPE.NORMAL, contents: 'Main commands: '});
        for (let i = 0; i < MAIN_COMMANDS.length; i++) {
            output.push({
                type: OUTPUT_TYPE.NORMAL,
                contents:
                    `${' '.repeat(8)}${MAIN_COMMANDS[i]} - ${MAIN_COMMANDS_DESCRIPTIONS[MAIN_COMMANDS[i]]}`,
            });
        }

        output.push({type: OUTPUT_TYPE.SUCCESS, contents: 'Options: '});
        for (let i = 0; i < ALLOWED_FLAGS.length; i++) {
            const currentFlag: string = ALLOWED_FLAGS[i];
            output.push({
                type: OUTPUT_TYPE.NORMAL,
                contents: `${' '.repeat(8)}${currentFlag} - ${ALLOWED_FLAGS_DESCRIPTIONS[currentFlag]}`
            });
        }
        this.userInterface.showOutput(output, done);
    }
}
