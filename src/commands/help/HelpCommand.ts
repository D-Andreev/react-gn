import ICommand from '../interfaces/ICommand';
import IUserInterface from '../../services/interfaces/IUserInterface';
import {
    ALIAS,
    ASCII_ART,
    MAIN_COMMANDS,
    MAIN_COMMANDS_DESCRIPTIONS,
    OUTPUT_TYPE
} from '../../constants';
import Output from '../../lib/Output';
import {EOL} from 'os';

export default class HelpCommand implements ICommand {
    private readonly userInterface: IUserInterface;

    constructor(userInterface: IUserInterface) {
        this.userInterface = userInterface;
    }

    execute(done: Function): void {
        const output: Output[] = [
            { type: OUTPUT_TYPE.NORMAL, contents: ASCII_ART.HELP }
        ];

        for (let i = 0; i < MAIN_COMMANDS.length; i++) {
            const mainCommand = `${MAIN_COMMANDS[i]} - ${MAIN_COMMANDS_DESCRIPTIONS[MAIN_COMMANDS[i]]}`;
            let subCommands = '';
            for (const s in ALIAS[MAIN_COMMANDS[i]]) {
                const current = ALIAS[MAIN_COMMANDS[i]][s];
                subCommands += `${' '.repeat(2)}${current}${EOL}`;
            }
            output.push({
                type: OUTPUT_TYPE.SUCCESS,
                contents: mainCommand,
                }
            );
            output.push({
                type: OUTPUT_TYPE.NORMAL,
                contents: subCommands
            })
        }

        this.userInterface.showOutput(output, done);
    }
}
