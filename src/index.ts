#!/usr/bin/env node

import CommandFactory from './commands/CommandFactory';
import ICommand from './commands/interfaces/ICommand'

const command: ICommand = CommandFactory.createCommand(process.argv);
command.execute();
