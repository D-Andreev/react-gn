import EventEmitter from 'events';
import InitCommand from '../../../src/commands/init/InitCommand';
import IStorage from '../../../src/services/interfaces/IStorage';
import IUserInterface from '../../../src/user-interface/interfaces/IUserInterface';
import ICra from '../../../src/services/interfaces/ICra';
import MockStorage from '../../mock/MockStorage';
import Output from '../../../src/commands/Output';
import Flag from '../../../src/commands/Flag';
import IInitCommand from '../../../src/commands/interfaces/IInitCommand';

describe('InitCommand', () => {
    let storage: IStorage;
    let userInterface: IUserInterface;
    let initCommand: IInitCommand;
    let cra: ICra;
    let appName: string;
    let flags: Flag[];
    let path: string;

    beforeEach(() => {
        storage = new MockStorage();
        userInterface = new class implements IUserInterface {
            askQuestion(question: string, done: Function): void {
            }

            showOutput(output: Output[], done: Function): void {
            }
        };
        cra = new class implements ICra {
            createApp(name: string, path: string, args?: string[]): any {
                return new EventEmitter();
            }

            ejectApp(path: string): void {
            }

            emit(event: string, ...args: any[]): boolean {
                return false;
            }

            on(event: string, listener: Function): this {
                return this;
            }
        };
        flags = [];
        initCommand = new InitCommand(storage, userInterface, cra, appName, flags, path);
    });

    it('calls cra.createApp with args', () => {
        cra.createApp = jest.fn();
        initCommand.initApp([], () => {});
        expect(cra.createApp).toHaveBeenCalledWith(appName, path, []);
    });
});
