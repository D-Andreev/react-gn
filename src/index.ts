#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import CommandFactory from './commands/CommandFactory';
import StorageService from './services/Storage';
import IStorage from './services/interfaces/IStorage';

const storage: IStorage = new StorageService(fs, path);
new CommandFactory(storage).createCommand(process.argv, () => {});
