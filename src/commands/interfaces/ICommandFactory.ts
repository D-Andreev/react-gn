import ICommand from './ICommand';

export interface ICommandFactory {
    createCommand(commandArguments: string[]): ICommand;
}
