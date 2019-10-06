import ICommand from '../interfaces/ICommand';
import IStorage from '../../services/interfaces/IStorage';
import IUserInterface from '../../user-interface/interfaces/IUserInterface';
import Flag from '../Flag';
import ICra from '../../services/interfaces/ICra';
import {CRA_EVENT, OUTPUT_TYPE} from '../../constants';
import Output from '../Output';
import {noop} from '../../utils';

export default class JsAppCommand implements ICommand {
    private readonly storage: IStorage;
    private readonly userInterface: IUserInterface;
    private readonly cra: ICra;
    private readonly appName: string;
    private readonly flags: Flag[];
    private readonly path: string;

    constructor(
        storage: IStorage, userInterface: IUserInterface, cra: ICra, appName: string, flags: Flag[], path: string) {
        this.storage = storage;
        this.userInterface = userInterface;
        this.cra = cra;
        this.appName = appName;
        this.flags = flags;
        this.path = path;
    }

    execute(done: Function): void {
        this.cra.createApp(this.appName, this.path);
        this.cra.on(CRA_EVENT.INIT_ERROR, (err: ErrorEvent) => {
            const output: Output[] = [new Output(err.toString(), OUTPUT_TYPE.ERROR)];
            this.userInterface.showOutput(output, noop);
            done(err);
        });
        this.cra.on(CRA_EVENT.INIT_DATA, (data: string) => {
            this.userInterface.showOutput([new Output(data, OUTPUT_TYPE.NORMAL)], noop);
        });
        this.cra.on(CRA_EVENT.INIT_CLOSE, (code: number) => {
            if (code === 0) {
                const contents = `${this.appName} was generated successfully!`;
                const output: Output[] = [new Output(contents, OUTPUT_TYPE.SUCCESS)];
                this.userInterface.showOutput(output, noop);
                done();
            } else {
                const contents = `CRA exited with ${code}`;
                const output: Output[] = [new Output(contents, OUTPUT_TYPE.ERROR)];
                this.userInterface.showOutput(output, noop);
                done(new Error(contents));
            }
        });
    }
}
