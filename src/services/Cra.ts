import {ChildProcessWithoutNullStreams} from 'child_process';
import ICra from './interfaces/ICra';
import EventEmitter from 'events';
import {CRA_EVENT} from '../constants';

export default class Cra extends EventEmitter implements ICra {
    private readonly childProcess: typeof import('child_process');

    constructor(childProcess: typeof import('child_process')) {
        super();
        this.childProcess = childProcess;
    }

    createApp(name: string, path: string): void {
        const {spawn} = this.childProcess;
        const child: ChildProcessWithoutNullStreams = spawn(`create-react-app ${name}`);
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
    }
}
