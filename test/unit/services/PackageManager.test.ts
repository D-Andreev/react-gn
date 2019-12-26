import PackageManager from '../../../src/services/PackageManager';
import IPackageManager from '../../../src/services/interfaces/IPackageManager';
import * as childProcess from 'child_process';
import Cli from '../../../src/services/user-interface/Cli';
import * as readline from 'readline';
import * as inquirer from 'inquirer';
import {IDependency} from '../../../src/commands/interfaces/ITemplate';
import IUserInterface from '../../../src/services/interfaces/IUserInterface';

describe('PackageManager', () => {
    let packageManager: IPackageManager;
    let dependencies: IDependency[];
    let targetDir: string;
    let userInterface: IUserInterface;

    beforeEach(() => {
        dependencies = [
            {name: 'dep1', version: '1', isDev: true},
            {name: 'dep2'},
            {name: 'dep3', isDev: false}
        ];
        targetDir = './path/to/dir';
        userInterface = new Cli(process.stdout, readline);
        // @ts-ignore
        childProcess.execSync = jest.fn();
        userInterface.showOutput = jest.fn((output: any, done: Function) => {
            done();
        });
        packageManager = new PackageManager(userInterface, childProcess);
    });

    describe('installDependencies', () => {
        it('installs the dependencies and shows output', () => {
            packageManager.installDependencies(dependencies, targetDir, (err: Error) => {
                expect(err).toBeFalsy();
                // @ts-ignore
                expect(childProcess.execSync.mock.calls[0])
                    .toEqual(['npm install dep1@1--save-dev', {'cwd': './path/to/dir'}]);
                // @ts-ignore
                expect(childProcess.execSync.mock.calls[1])
                    .toEqual(['npm install dep2', {'cwd': './path/to/dir'}]);
                // @ts-ignore
                expect(childProcess.execSync.mock.calls[2])
                    .toEqual(['npm install dep3', {'cwd': './path/to/dir'}]);
            });
        });
    });
});
