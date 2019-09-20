import Cli from '../../../src/user-interface/Cli';
import IUserInterface from '../../../src/user-interface/interfaces/IUserInterface';
import {ERROR, OUTPUT_TYPE} from '../../../src/constants';
import {FgWhite} from '../../../src/user-interface/colors';

describe('Cli', () => {
    let cli: IUserInterface;
    let done: Function | jest.Mock<any, any>;

    beforeEach(() => {
        // @ts-ignore
        global.console = {log: jest.fn()};
        cli = new Cli(global.console);
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
                for (let i = 0; i < 3; i++) {
                    expect(global.console.log).toHaveBeenNthCalledWith(i + 1, output[i].contents, FgWhite)
                }

                expect(done).toHaveBeenCalledWith();
            });
        });
    });
});
