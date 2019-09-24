import childProcess from 'child_process';
import {EventEmitter} from 'events';
import Cra from '../../../src/services/Cra';
import ICra from '../../../src/services/interfaces/ICra';
import MockStorage from '../../mock/MockStorage';
import {CRA_EVENT} from '../../../src/constants';
import IStorage from '../../../src/services/interfaces/IStorage';

jest.mock('child_process');

describe('Cra', () => {
    let cra: ICra;
    let storage: IStorage;
    let spawn: any;

    beforeEach(() => {
        storage = new MockStorage();
        storage.directoryExists = jest.fn((path: string, done: Function) => {
             done(new Error('not found'));
        });
        spawn = jest.fn((command: string, args: string[], opts: any) => {
            class MockSpawn extends EventEmitter {
                constructor() {
                    super();
                }
            }

            const mockSpawn = new MockSpawn();

            return mockSpawn;
        });
        cra = new Cra(storage, childProcess);
    });

    describe('createApp', () => {
        describe('when target dir exists', () => {
            it('yields error', (done) => {
                cra.on(CRA_EVENT.INIT_ERROR, (err: any) => {
                    done(err);
                });
                cra.createApp('test', './invalid-path');
            });
        });

        describe('when directory exists', () => {
            it('executes the command', (done) => {
                cra.on(CRA_EVENT.INIT_ERROR, (err: any) => {
                    done(err);
                });
                cra.on(CRA_EVENT.INIT_DATA, (data: string) => {
                    console.log('data', data);
                });
                cra.on(CRA_EVENT.INIT_CLOSE, (code: number) => {
                    expect(code).toEqual(0);
                    done();
                });
                cra.createApp('test', './');
            });
        });
    });

});
