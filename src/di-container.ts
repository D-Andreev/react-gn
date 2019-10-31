import 'reflect-metadata';
import {container} from 'tsyringe';
import fs from 'fs';
import path from 'path';
import childProcess from 'child_process';
import Cra from './services/Cra';
import Cli from './user-interface/Cli';
import UnknownCommand from './commands/UnknownCommand';
import VersionCommand from './commands/VersionCommand';
import readline from 'readline';
import Storage from './services/Storage';
import DependencyContainer from 'tsyringe/dist/typings/types/dependency-container';
import JsAppCommand from './commands/init/JsAppCommand';
import TsAppCommand from './commands/init/TsAppCommand';

export function init() {
    container.register('fs', {
        useValue: fs
    });
    container.register('path', {
        useValue: path
    });
    container.register('childProcess', {
        useValue: childProcess,
    });
    container.register('stdout', {
        useValue: process.stdout,
    });
    container.register('cra', {
        useClass: Cra
    });
    container.register('userInterface', {
        useClass: Cli
    });
    container.register('UnknownCommand', {
        useClass: UnknownCommand
    });
    container.register('VersionCommand', {
        useClass: VersionCommand
    });
    container.register('readline', {
        useValue: readline
    });
    container.register('storage', {
        useClass: Storage
    });
    container.register('JsAppCommand', {
        useFactory: (container: DependencyContainer) => {
            return new JsAppCommand(container.resolve('storage'), container.resolve('userInterface'),
                container.resolve('cra'), childProcess);
        }
    });
    container.register('TsAppCommand', {
        useFactory: (container: DependencyContainer) => {
            return new TsAppCommand(container.resolve('storage'), container.resolve('userInterface'),
                container.resolve('cra'), childProcess);
        }
    });
}
