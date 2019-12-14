import readline from 'readline';
import Cli from '../../../src/user-interface/Cli';
import IUserInterface from '../../../src/user-interface/interfaces/IUserInterface';
import {ERROR, OUTPUT_TYPE} from '../../../src/constants';
import {FgWhite} from '../../../src/user-interface/colors';
import inquirer from 'inquirer';

describe('Cli', () => {
    let cli: IUserInterface;
    let done: Function | jest.Mock<any, any>;
    let stdout: any;

    beforeEach(() => {
        stdout = process.stdout;
        stdout.write = jest.fn();
        cli = new Cli(stdout, readline, inquirer);
        done = jest.fn();
    });

    describe('showOutput', () => {
        describe('when output is invalid', () => {
            it('yields error', () => {
                cli.showOutput([], done);
                expect(done).toHaveBeenCalledWith(new Error(ERROR.INVALID_OUTPUT));
            });
        });

        describe('when output is valid', () => {
            it('shows the output', () => {
                const output = [];
                for (let i = 0; i < 3; i++) {
                    output.push({contents: 'test' + i, type: OUTPUT_TYPE.NORMAL});
                }
                cli.showOutput(output, done);
                expect(stdout.write).toHaveBeenNthCalledWith(1, FgWhite);
                expect(stdout.write).toHaveBeenNthCalledWith(2, output[0].contents);

                expect(done).toHaveBeenCalledWith();
            });
        });
    });

    describe('askQuestion', () => {
        describe('when answer is affirmative', () => {
            let question: string;
            beforeEach(() => {
                question = 'Are you sure?';
                // @ts-ignore
                readline.createInterface = jest.fn(() => {
                    return {
                        question: jest.fn((q: string, cb: Function) => {
                            cb('y');
                        }),
                        close: jest.fn(),
                    }
                });
            });

            it('yields the answer', (done) => {
                const cb = (err: any, answer: string) => {
                    expect(err).toBeFalsy();
                    expect(answer).toEqual('y');
                    done();
                };

                cli.askQuestion(question, cb);
            });
        });

        describe('when answer is negative', () => {
            let question: string;
            beforeEach(() => {
                question = 'Are you sure?';
                // @ts-ignore
                readline.createInterface = jest.fn(() => {
                    return {
                        question: jest.fn((q: string, cb: Function) => {
                            cb('n');
                        }),
                        close: jest.fn(),
                    }
                });
            });

            it('yields the answer', (done) => {
                const cb = (err: any, answer: string) => {
                    expect(err).toBeFalsy();
                    expect(answer).toEqual('n');
                    done();
                };

                cli.askQuestion(question, cb);
            });
        });
    });
});
