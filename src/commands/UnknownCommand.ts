import ICommand from './interfaces/ICommand';
import IUserInterface from '../user-interface/interfaces/IUserInterface';

export default class UnknownCommand implements ICommand {
    private readonly userInterface: IUserInterface;

    constructor(userInterface: IUserInterface) {
        this.userInterface = userInterface;
    }

    execute(): void {
        console.log('HELP');
    }
}
