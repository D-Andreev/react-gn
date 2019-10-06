import EventEmitter from 'events';
import JsAppCommand from '../../../src/commands/init/JsAppCommand';
import IStorage from '../../../src/services/interfaces/IStorage';
import IUserInterface from '../../../src/user-interface/interfaces/IUserInterface';
import ICra from '../../../src/services/interfaces/ICra';
import MockStorage from '../../mock/MockStorage';
import Output from '../../../src/commands/Output';
import Flag from '../../../src/commands/Flag';

describe('JsAppCommand', () => {
    let storage: IStorage;
    let userInterface: IUserInterface;
    let jsAppCommand: any;
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
        jsAppCommand = new JsAppCommand(storage, userInterface, cra, appName, flags, path);
    });

    it('calls initApp with args', (done) => {
        jsAppCommand.initApp = jest.fn((args: any, cb: any) => {
            cb();
        });
        jsAppCommand.execute(() => {
            expect(jsAppCommand.initApp).toHaveBeenCalledWith([], expect.any(Function));
            done();
        });
    });
});
