#!/usr/bin/env node

import * as fs from 'fs';
import CommandFactory from './commands/CommandFactory';
import StorageService from './services/Storage';
import IStorage from './services/interfaces/IStorage';

const storage: IStorage = new StorageService(fs);
new CommandFactory(storage).createCommand(process.argv, () => {});
