import {ChildProcessWithoutNullStreams} from 'child_process';
import ICra from './interfaces/ICra';
import EventEmitter from 'events';
import {CRA_EVENT} from '../constants';
import IStorage from './interfaces/IStorage';
import ErrnoException = NodeJS.ErrnoException;

export default class Cra extends EventEmitter implements ICra {
    private readonly storage: IStorage;
    private readonly childProcess: typeof import('child_process');

    constructor(storage: IStorage, childProcess: typeof import('child_process')) {
        super();
        this.storage = storage;
        this.childProcess = childProcess;
    }

    createApp(name: string, path: string): void {
        this.storage.directoryExists(path, (err: ErrnoException) => {
            if (err) {
                this.emit(CRA_EVENT.INIT_ERROR, err);
                return;
            }

            const {spawn} = this.childProcess;
            const command = `cd ${path} && create-react-app`;
            const child: ChildProcessWithoutNullStreams = spawn(command, [name], {shell: true});
            child.stderr.setEncoding('utf8');
            child.stderr.on('data', (err: Error) => {
                this.emit(CRA_EVENT.INIT_ERROR, err);
            });
            child.stdout.setEncoding('utf8');
            child.stdout.on('data', (data: Buffer) => {
                this.emit(CRA_EVENT.INIT_DATA, data.toString());
            });
            child.on('close', (code: number) => {
                this.emit(CRA_EVENT.INIT_CLOSE, code);
            });
        });
    }
}
