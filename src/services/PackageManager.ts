import IUserInterface from '../user-interface/interfaces/IUserInterface';
import {IDependency} from '../commands/interfaces/ITemplate';
import steed from 'steed';
import Output from '../commands/Output';
import {OUTPUT_TYPE} from '../constants';
import {noop} from '../utils';
import IPackageManager from './interfaces/IPackageManager';

export default class PackageManager implements IPackageManager {
    private readonly userInterface: IUserInterface;
    private readonly childProcess: typeof import('child_process');

    constructor(userInterface: IUserInterface, childProcess: typeof import('child_process')) {
        this.userInterface = userInterface;
        this.childProcess = childProcess;
    }

    public installDependencies(dependencies: IDependency[], targetDir: string, done: Function): void {
        steed.mapSeries(dependencies, (current: IDependency, next: Function) => {
            const version = current.version ? `@${current.version}` : '';
            const devFlag = current.isDev ? '--save-dev' : '';
            try {
                this.childProcess.execSync(
                    `npm install ${current.name}${version}${devFlag}`, {cwd: targetDir});
            } catch (e) {
                const output: Output[] = [new Output(e.message, OUTPUT_TYPE.ERROR)];
                this.userInterface.showOutput(output, noop);
                next(e);
            }
            const output: Output[] = [
                new Output(`Installed ${current.name} successfully!`, OUTPUT_TYPE.SUCCESS)
            ];
            this.userInterface.showOutput(output, next);
        }, (err: ErrorEvent) => done(err));
    }
}