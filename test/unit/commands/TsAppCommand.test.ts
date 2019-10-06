import EventEmitter from 'events';
import TsAppCommand from '../../../src/commands/init/TsAppCommand';
import IStorage from '../../../src/services/interfaces/IStorage';
import IUserInterface from '../../../src/user-interface/interfaces/IUserInterface';
import ICra from '../../../src/services/interfaces/ICra';
import MockStorage from '../../mock/MockStorage';
import Flag from '../../../src/commands/Flag';

describe('TsAppCommand', () => {
    let storage: IStorage;
    let userInterface: IUserInterface;
    let tsAppCommand: any;
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
        tsAppCommand = new TsAppCommand(storage, userInterface, cra, appName, flags, path);
    });

    it('calls initApp with args', (done) => {
        tsAppCommand.initApp = jest.fn((args: any, cb: any) => {
            cb();
        });
        tsAppCommand.execute(() => {
            expect(tsAppCommand.initApp).toHaveBeenCalledWith(['--typescript'], expect.any(Function));
            done();
        });
    });
});
