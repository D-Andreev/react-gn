#!/usr/bin/env node

import 'reflect-metadata';
import fs from 'fs';
import path from 'path';
import readline from 'readline';
import childProcess from 'child_process';
import CommandFactory from './commands/CommandFactory';
import {noop} from './utils';
import {container} from 'tsyringe';
import Cli from './user-interface/Cli';
import UnknownCommand from './commands/UnknownCommand';
import VersionCommand from './commands/VersionCommand';
import Storage from './services/Storage';
import JsAppCommand from './commands/init/JsAppCommand';
import DependencyContainer from 'tsyringe/dist/typings/types/dependency-container';
import Cra from './services/Cra';
import TsAppCommand from './commands/init/TsAppCommand';

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

new CommandFactory().createCommand(process.argv, noop);
