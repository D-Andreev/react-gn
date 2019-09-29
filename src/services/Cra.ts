import {ChildProcessWithoutNullStreams} from 'child_process';
import ICra from './interfaces/ICra';
import EventEmitter from 'events';
import {CRA_EVENT} from '../constants';
import IStorage from './interfaces/IStorage';
import ErrnoException = NodeJS.ErrnoException;

export type Listener = (...args: any[]) => void;

export default class Cra extends EventEmitter implements ICra {
    private readonly storage: IStorage;
    private readonly childProcess: typeof import('child_process');

    private spawnChild(command: string, args: string[], onError: Listener, onData: Listener, onClose: Listener) {
        const {spawn} = this.childProcess;
        const child: ChildProcessWithoutNullStreams = spawn(command, args, {shell: true});
        child.stderr.setEncoding('utf8');
        child.stdout.setEncoding('utf8');
        child.stderr.on('data', onError);
        child.stdout.on('data', onData);
        child.on('close', onClose);
    }

    constructor(storage: IStorage, childProcess: typeof import('child_process')) {
        super();
        this.storage = storage;
        this.childProcess = childProcess;
    }

    createApp(name: string, path: string, args?: string[]): void {
        this.storage.directoryExists(path, (err: ErrnoException) => {
            if (err) {
                this.emit(CRA_EVENT.INIT_ERROR, err);
                return;
            }

            const command = `cd ${path} && create-react-app`;
            let commandArguments = [name];
            if (args) {
                commandArguments = commandArguments.concat(args);
            }
            const onError: Listener = (err: Error) => {
                this.emit(CRA_EVENT.INIT_ERROR, err);
            };
            const onData: Listener = (data: Buffer) => {
                this.emit(CRA_EVENT.INIT_DATA, data.toString());
            };
            const onClose: Listener = (code: number) => {
                this.emit(CRA_EVENT.INIT_CLOSE, code);
            };
            this.spawnChild(command, commandArguments, onError, onData, onClose);
        });
    }

    ejectApp(path: string): void {
        this.storage.directoryExists(path, (err: ErrnoException) => {
            if (err) {
                this.emit(CRA_EVENT.EJECT_ERROR, err);
                return;
            }

            const command = `cd ${path} && npm run eject`;
            const commandArguments = ['-y'];
            const onError: Listener = (err: Error) => {
                this.emit(CRA_EVENT.EJECT_ERROR, err);
            };
            const onData: Listener = (data: Buffer) => {
                this.emit(CRA_EVENT.EJECT_DATA, data.toString());
            };
            const onClose: Listener = (code: number) => {
                this.emit(CRA_EVENT.EJECT_CLOSE, code);
            };
            this.spawnChild(command, commandArguments, onError, onData, onClose);
        })
    }
}
