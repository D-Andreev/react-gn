import ICommand from '../interfaces/ICommand';
import IUserInterface from '../../services/interfaces/IUserInterface';
import {getEditDistance, noop} from '../../utils';
import {COMMAND, COMMAND_FLAG, OUTPUT_TYPE, PACKAGE_NAME} from '../../constants';
import Output from '../../lib/Output';
import {EOL} from 'os';

const SIMILARITY_THRESHOLD = 65;
export type Similarity = {
    similarity: number;
    index: number;
}

export default class UnknownCommand implements ICommand {
    private readonly userInterface: IUserInterface;
    private readonly command: string;

    constructor(userInterface: IUserInterface, command: string) {
        this.userInterface = userInterface;
        this.command = command;
    }

    execute(done: Function): void {
        const similarities: Similarity[] = [];
        const correctCommands: string[] = Object.values(COMMAND);
        correctCommands.forEach((correctCommand: string, index: number) => {
            const editDistance: number =
                getEditDistance(this.command, correctCommand, this.command.length, correctCommand.length);
            const similarity: number =
                100 - (editDistance / Math.max(this.command.length, correctCommand.length) * 100);
             similarities.push({
                 similarity,
                 index
             });
        });

        const maxSimilarity: number = Math.max(...similarities.map(s => s.similarity));
        const maxSimilarityIndex: number = similarities.findIndex(s => s.similarity === maxSimilarity);
        let message = `Command ${this.command} is not recognized. `;
        if (maxSimilarity >= SIMILARITY_THRESHOLD) {
            message += `${EOL}Did you mean ${correctCommands[similarities[maxSimilarityIndex].index]}?`;
        }
        message += `${EOL}For help please run ${PACKAGE_NAME} ${COMMAND_FLAG.HELP}`;
        const output: Output[] = [new Output(message, OUTPUT_TYPE.NORMAL)];
        this.userInterface.showOutput(output, noop);
        done();
    }
}
