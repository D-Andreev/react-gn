import EventEmitter from 'events';
import JsAppCommand from '../../../src/commands/init/JsAppCommand';
import IStorage from '../../../src/services/interfaces/IStorage';
import IUserInterface from '../../../src/user-interface/interfaces/IUserInterface';
import ICra from '../../../src/services/interfaces/ICra';
import MockStorage from '../../mock/MockStorage';
import Flag from '../../../src/commands/Flag';
import childProcess from 'child_process';

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
            askQuestion(): void {
            }

            showOutput(): void {
            }
        };
        cra = new class implements ICra {
            createApp(): any {
                return new EventEmitter();
            }

            ejectApp(): void {
            }

            emit(): boolean {
                return false;
            }

            on(): this {
                return this;
            }
        };
        flags = [];
        jsAppCommand = new JsAppCommand(storage, userInterface, cra, childProcess);
        jsAppCommand.setAppMetadata(appName, flags, path);
    });

    xit('calls initApp with args', (done) => {
        jsAppCommand.initApp = jest.fn((args: any, cb: any) => {
            cb();
        });
        jsAppCommand.execute(() => {
            expect(jsAppCommand.initApp).toHaveBeenCalledWith([], expect.any(Function));
            done();
        });
    });
});
