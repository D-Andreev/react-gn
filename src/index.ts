#!/usr/bin/env node

import CommandFactory from './commands/CommandFactory';
import ICommand from './commands/interfaces/ICommand';
import StorageService from './services/Storage';
import IStorage from './services/interfaces/IStorage';

const storage: IStorage = new StorageService();
const command: ICommand = new CommandFactory(storage).createCommand(process.argv);

command.execute();
