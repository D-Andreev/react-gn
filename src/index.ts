#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import childProcess from 'child_process';
import CommandFactory from './commands/CommandFactory';
import StorageService from './services/Storage';
import IStorage from './services/interfaces/IStorage';
import ICra from './services/interfaces/ICra';
import Cra from './services/Cra';
import {noop} from './utils';
import ITemplateService from './services/interfaces/ITemplateService';
import TemplateService from './services/Template';
import ejs from 'ejs';
import IPackageManager from './services/interfaces/IPackageManager';
import PackageManager from './services/PackageManager';
import IUserInterface from './user-interface/interfaces/IUserInterface';
import Cli from './user-interface/Cli';
import * as readline from 'readline';
import inquirer from 'inquirer';

const storage: IStorage = new StorageService(fs, path);
const cra: ICra = new Cra(storage, childProcess);
const templateService: ITemplateService = new TemplateService(ejs);
const userInterface: IUserInterface = new Cli(process.stdout, readline, inquirer);
const packageManager: IPackageManager = new PackageManager(userInterface, childProcess);
new CommandFactory(storage, templateService, cra, childProcess, userInterface, packageManager).createCommand(process.argv, noop);
