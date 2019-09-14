import ICommand from './interfaces/ICommand';

export default class UnknownCommand implements ICommand {
    execute(): void {}
}
