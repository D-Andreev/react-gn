import EventEmitter from 'events';
import InitCommand from '../../../src/commands/init/InitCommand';
import IStorage from '../../../src/services/interfaces/IStorage';
import IUserInterface from '../../../src/user-interface/interfaces/IUserInterface';
import ICra from '../../../src/services/interfaces/ICra';
import MockStorage from '../../mock/MockStorage';
import Flag from '../../../src/commands/Flag';
import IInitCommand from '../../../src/commands/interfaces/IInitCommand';
import childProcess from 'child_process';
import {LANGUAGE_TYPE} from '../../../src/constants';
import {sep} from 'path';

describe('InitCommand', () => {
    let storage: IStorage;
    let userInterface: IUserInterface;
    let initCommand: IInitCommand;
    let cra: ICra;
    let appName: string;
    let flags: Flag[];
    let path: string;

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
        appName = 'my-test-app';
        initCommand = new InitCommand(storage, userInterface, cra, childProcess);
        initCommand.setAppMetadata(appName, flags, path);
    });

    describe('initApp', () => {
        it('calls cra.createApp with args', () => {
            cra.createApp = jest.fn();
            initCommand.initApp([], () => {});
            expect(cra.createApp).toHaveBeenCalledWith(appName, path, []);
        });
    });

    describe('applyConfigurations', () => {
        describe('when no flags with templates are found', () => {
            it('yields error', (done) => {
                // @ts-ignore
                initCommand.getFlagsWithTemplates = jest.fn(() => {
                    return [];
                });
                initCommand.applyConfigOptions(LANGUAGE_TYPE.JS, (err: Error) => {
                    expect(err).toBeTruthy();
                    expect(err instanceof Error).toBeTruthy();
                    done();
                });
            });
        });

        describe('when flags with templates are found', () => {
            describe('when template for a flag is not found', () => {
                it('yields error', (done) => {
                    flags = [{name: 'invalid-flag', value: ''}];
                    initCommand = new InitCommand(storage, userInterface, cra, childProcess);
                    initCommand = new InitCommand(storage, userInterface, cra, childProcess);
                    initCommand.setAppMetadata(appName, flags, path);
                    // @ts-ignore
                    initCommand.getFlagsWithTemplates = jest.fn(() => {
                        return [{name: 'invalid-flag', value: ''}];
                    });
                    // @ts-ignore
                    initCommand.getTemplateByFlag = jest.fn(() => {
                        throw new Error('No such template');
                    });
                    // @ts-ignore
                    InitCommand.removeFiles = jest.fn((
                        template: any, paths: string[], languageType: string, done: Function) => {
                        done();
                    });
                    initCommand.applyConfigOptions(LANGUAGE_TYPE.JS, (err: Error) => {
                        expect(err).toBeTruthy();
                        expect(err instanceof Error).toBeTruthy();
                        expect(err.message).toEqual('No such template');
                        done();
                    });
                });
            });

            describe('when templates for flags are found', () => {
                beforeEach(() => {
                    flags = [{name: '--withRedux', value: ''}];
                    initCommand = new InitCommand(storage, userInterface, cra, childProcess);
                    initCommand.setAppMetadata(appName, flags, path);
                    // @ts-ignore
                    initCommand.getFlagsWithTemplates = jest.fn(() => {
                        return ['--withRedux'];
                    });
                    // @ts-ignore
                    InitCommand.getTemplateByFlag = jest.fn(() => {
                        return {
                            dependencies: {js: [{name: '', version: '', isDev: true}]},
                            'src/App': {js: {extension: 'js', contents: 'test'}}};
                    });
                });

                describe('when there is an error removing the files', () => {
                    beforeEach(() => {
                        // @ts-ignore
                        initCommand.removeFiles = jest.fn((
                            template: any, paths: string[], languageType: string, done: Function) => {
                            done(new Error('Error removing files'));
                        });
                    });

                    it('yields error', (done) => {
                        initCommand.applyConfigOptions(LANGUAGE_TYPE.JS, (err: Error) => {
                            expect(err).toBeTruthy();
                            expect(err instanceof Error).toBeTruthy();
                            expect(err.message).toEqual('Error removing files');
                            done();
                        });
                    });
                });

                describe('when there is an error creating the paths', () => {
                    beforeEach(() => {
                        // @ts-ignore
                        storage.createPaths = jest.fn((path: string, paths: any, done: Function) => {
                            done(new Error('CreatePaths error'));
                        });
                    });

                    it('yields error', (done) => {
                        initCommand.applyConfigOptions(LANGUAGE_TYPE.JS, (err: Error) => {
                            expect(err).toBeTruthy();
                            expect(err instanceof Error).toBeTruthy();
                            expect(err.message).toEqual('CreatePaths error');
                            done();
                        });
                    });
                });

                describe('when paths creation is successful', () => {
                    beforeEach(() => {
                        // @ts-ignore
                        storage.createPaths = jest.fn((path: string, paths: any, done: Function) => {
                            done();
                        });
                    });

                    describe('when npm install fails', () => {
                        it('yields error', (done) => {
                            // @ts-ignore
                            initCommand.childProcess.execSync = jest.fn(() => {
                                throw new Error('err');
                            });
                            initCommand.applyConfigOptions(LANGUAGE_TYPE.JS, (err: Error) => {
                                expect(err).toBeTruthy();
                                expect(err instanceof Error).toBeTruthy();
                                expect(err.message).toEqual('err');
                                done();
                            });
                        });
                    });

                    describe('when npm install is successful', () => {
                        beforeEach(() => {
                            // @ts-ignore
                            initCommand.childProcess.execSync = jest.fn(() => {
                                return '';
                            });
                        });

                        describe('when file does not exist', () => {
                            beforeEach(() => {
                                storage.directoryExists = jest.fn((path: string, done: Function) => {
                                    done(new Error('err'));
                                });
                                // @ts-ignore
                                initCommand.storage.create = jest.fn((
                                    name: string,
                                    content: string,
                                    done: Function
                                ) => {
                                    done(new Error('err'));
                                });
                            });

                            it('creates it', (done) => {
                                initCommand.applyConfigOptions(LANGUAGE_TYPE.JS, () => {
                                    // @ts-ignore
                                    expect(initCommand.storage.create)
                                        .toHaveBeenCalledWith(
                                            `my-app${sep}my-test-app${sep}src${sep}actions${sep}simpleAction.js`,
                                            expect.any(String),
                                            expect.any(Function)
                                        );
                                    done();
                                });
                            });

                            describe('when there is an error creating the file', () => {
                                it('yields error', (done) => {
                                    initCommand.applyConfigOptions(LANGUAGE_TYPE.JS, (err: Error) => {
                                        expect(err.message).toEqual('err');
                                        done();
                                    });
                                });
                            });
                        });

                        describe('when file exists', () => {
                            beforeEach(() => {
                                storage.directoryExists = jest.fn((path: string, done: Function) => {
                                    done();
                                });
                                // @ts-ignore
                                initCommand.storage.update = jest.fn((
                                    name: string,
                                    content: string,
                                    done: Function
                                ) => {
                                    done(new Error('err'));
                                });
                            });

                            it('updates it', (done) => {
                                initCommand.applyConfigOptions(LANGUAGE_TYPE.JS, () => {
                                    // @ts-ignore
                                    expect(initCommand.storage.update)
                                        .toHaveBeenCalledWith(
                                            `my-app${sep}my-test-app${sep}src${sep}actions${sep}simpleAction.js`,
                                            expect.any(String),
                                            expect.any(Function)
                                        );
                                    done();
                                });
                            });

                            describe('when there is an error updating the file', () => {
                                it('yields error', (done) => {
                                    initCommand.applyConfigOptions(LANGUAGE_TYPE.JS, (err: Error) => {
                                        expect(err.message).toEqual('err');
                                        done();
                                    });
                                });
                            });
                        });
                    });
                });
            });
        });
    });
});
