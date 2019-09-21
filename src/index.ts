#!/usr/bin/env node

import CommandFactory from './commands/CommandFactory';
import StorageService from './services/Storage';
import IStorage from './services/interfaces/IStorage';

const storage: IStorage = new StorageService();
new CommandFactory(storage).createCommand(process.argv, () => {});
