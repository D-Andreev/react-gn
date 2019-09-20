import ICommand from './interfaces/ICommand';

export default class UnknownCommand implements ICommand {
    execute(): void {
        console.log('HELP');
    }
}
