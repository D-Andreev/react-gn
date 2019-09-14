import CommandFactory from '../../src/commands/CommandFactory';
import ICommand from '../../src/commands/interfaces/ICommand';
import {SDK_NAME, COMMAND, ERROR} from '../../src/constants';
import JsAppCommand from '../../src/commands/JsAppCommand';
import TsAppCommand from '../../src/commands/TsAppCommand';
import UnknownCommand from '../../src/commands/UnknownCommand';

describe('CommandFactory', () => {
    describe('when I use the create command', () => {
        describe('when react-sdk name is not provided', () => {
           it('should throw an error', () => {
               expect(() => {
                   CommandFactory.createCommand([]);
               }).toThrow(new Error(ERROR.INVALID_COMMAND));
           });
        });

        describe('when command is not provided', () => {
            it('returns unknown command', () => {
                const command: ICommand = CommandFactory
                    .createCommand([SDK_NAME]);
                expect(command instanceof UnknownCommand).toBeTruthy();
            });
        });

        describe('when command is unknown', () => {
            it('returns unknown command', () => {
                const command: ICommand = CommandFactory
                    .createCommand([SDK_NAME]);
                expect(command instanceof UnknownCommand).toBeTruthy();
            });
        });

        describe('when app name is not provided', () => {
            it('should throw an error', () => {
                expect(() => {
                    CommandFactory.createCommand([SDK_NAME, COMMAND.CREATE]);
                }).toThrow(new Error(ERROR.INVALID_APP_NAME));
            });
        });

        describe('when language type is not provided', () => {
            it('returns js type command', () => {
                const command: ICommand = CommandFactory
                    .createCommand([SDK_NAME, COMMAND.CREATE, 'test-app']);
                expect(command instanceof JsAppCommand).toBeTruthy();
            });
        });

        describe('when js language type is provided', () => {
            it('returns js type command', () => {
                const command: ICommand = CommandFactory
                    .createCommand([SDK_NAME, COMMAND.CREATE, 'test-app', '--js']);
                expect(command instanceof JsAppCommand).toBeTruthy();
            });
        });

        describe('when ts language type is provided', () => {
            it('returns ts type command', () => {
                const command: ICommand = CommandFactory
                    .createCommand([SDK_NAME, COMMAND.CREATE, 'test-app', '--ts']);
                expect(command instanceof TsAppCommand).toBeTruthy();
            });
        });
    });
});
