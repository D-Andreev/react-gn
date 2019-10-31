#!/usr/bin/env node

import 'reflect-metadata';
import CommandFactory from './commands/CommandFactory';
import {noop} from './utils';
import {init} from './di-container';

init();
new CommandFactory().createCommand(process.argv, noop);
