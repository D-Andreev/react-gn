import EventEmitter from 'events';
import IStorage from '../../../src/services/interfaces/IStorage';
import IUserInterface from '../../../src/user-interface/interfaces/IUserInterface';
import ICra from '../../../src/services/interfaces/ICra';
import MockStorage from '../../mock/MockStorage';
import Flag from '../../../src/commands/Flag';
import childProcess from 'child_process';
import ComponentCommand from '../../../src/commands/generate/ComponentCommand';
import ICommand from '../../../src/commands/interfaces/ICommand';
import {NEW_COMPONENT_MESSAGE} from '../../../src/constants';

describe('generate command', () => {
    let storage: IStorage;
    let userInterface: IUserInterface;
    let componentCommand: ICommand;
    let cra: ICra;
    let componentName: string;
    let flags: Flag[];
    let path: string;
    let templatePth: string;

    beforeEach(() => {
        storage = new MockStorage();
        userInterface = new class implements IUserInterface {
            askQuestion(): void {
            }

            showOutput(): void {
            }
        };
        cra = new class implements ICra {
            createApp(): any {
                return new EventEmitter();
            }

            ejectApp(): void {
            }

            emit(): boolean {
                return false;
            }

            on(): this {
                return this;
            }
        };
        flags = [];
        path = 'my-app';
        componentName = 'myPosts';
        componentCommand = new ComponentCommand(
            storage, userInterface, childProcess, componentName, flags, './');
        templatePth = `./container/${componentName}/${componentName}.js`;
    });

    describe('execute', () => {
        describe('when template path is not provided', () => {
            it('yields error', (done) => {
                componentCommand.execute((err: ErrorEvent) => {
                    expect(err.message).toEqual(NEW_COMPONENT_MESSAGE.INVALID_TEMPLATE_PATH);
                    done();
                });
            });
        });

        describe('when template path does not exist', () => {
            it('yields error', (done) => {
                // @ts-ignore
                storage.directoryExists = jest.fn((path: string, done: Function) => {
                    done(new Error(NEW_COMPONENT_MESSAGE.INVALID_TEMPLATE_PATH))
                });
                componentCommand.execute((err: ErrorEvent) => {
                    expect(err.message).toEqual(NEW_COMPONENT_MESSAGE.INVALID_TEMPLATE_PATH);
                    done();
                });
            });
        });

        describe('when template path exists', () => {
            beforeEach(() => {
                // @ts-ignore
                storage.directoryExists = jest.fn((path: string, done: Function) => {
                    done()
                });
            });

            describe('when component name is not provided', () => {
                it('yields error', (done) => {
                    flags = [{name: '--template', value: 'test'}];
                    componentCommand = new ComponentCommand(
                        storage, userInterface, childProcess, null, flags, './');
                    componentCommand.execute((err: ErrorEvent) => {
                        expect(err.message).toEqual(NEW_COMPONENT_MESSAGE.INVALID_NAME);
                        done();
                    });
                });
            });

            describe('when component name is provided', () => {
                beforeEach(() => {
                    // @ts-ignore
                    storage.scanDirectory = jest.fn((path: string, done: Function) => {
                        done(null, [templatePth])
                    });
                });

                describe('when there is an error creating the paths', () => {
                    it('yields error', (done) => {
                        // @ts-ignore
                        storage.createPaths = jest.fn((
                            path: string, arr: string[], done: Function) => {
                            done(new Error('err'))
                        });
                        flags = [{name: '--template', value: templatePth}, {name: '--name', value: componentName}];
                        componentCommand = new ComponentCommand(
                            storage, userInterface, childProcess, componentName, flags, './');
                        componentCommand.execute((err: ErrorEvent) => {
                            expect(err.message).toEqual('err');
                            done();
                        });
                    });
                });

                describe('when all params are valid', () => {
                    it('creates the component', (done) => {
                        // @ts-ignore
                        storage.createPaths = jest.fn((
                            path: string, arr: string[], done: Function) => {
                            done(null, [templatePth])
                        });
                        // @ts-ignore
                        storage.generateFilePath = jest.fn((
                            parts: string[], done: Function) => {
                            done()
                        });
                        // @ts-ignore
                        storage.read = jest.fn((path: string, done: Function) => {
                            done(null, '')
                        });
                        // @ts-ignore
                        storage.create = jest.fn((
                            path: string, contents: string, done: Function) => {
                            done()
                        });
                        // @ts-ignore
                        componentCommand.transformFilePaths = () => [templatePth];
                        // @ts-ignore
                        componentCommand.renderTemplate = jest.fn((a: any, b: any, c: any, done: any) => {
                            done(null, 0);
                        });
                        flags = [{name: '--template', value: './templates/container'}, {name: '--name', value: componentName}];
                        componentCommand = new ComponentCommand(
                            storage, userInterface, childProcess, componentName, flags, './');
                        componentCommand.execute((err: ErrorEvent) => {
                            expect(err).toBeFalsy();
                            done();
                        });
                    });
                });
            });
        });
    });
});
