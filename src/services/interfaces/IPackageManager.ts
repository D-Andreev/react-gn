import {IDependency} from '../../commands/interfaces/ITemplate';

export default interface IPackageManager {
    installDependencies(dependencies: IDependency[], targetDir: string, done: Function): void;
}