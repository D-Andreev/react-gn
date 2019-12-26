import Prettier from '../../../src/services/Prettier';
import * as prettier from 'prettier';
import IPrettier from '../../../src/services/interfaces/IPrettier';

describe('Prettier', () => {
    let prettierService: IPrettier;

    beforeEach(() => {
        prettierService = new Prettier(prettier);
    });

    describe('prettify', () => {
        describe('when format throws an error', () => {
            it('yields error', (done) => {
                // @ts-ignore
                prettier.format = jest.fn(() => {
                    throw new Error('Error formatting code');
                });
                prettierService.prettify('', (err: Error) => {
                    expect(err.message).toEqual('Error formatting code');
                    done();
                });
            });
        });

        it('formats the code', () => {
            // @ts-ignore
            prettier.format = jest.fn(() => {
                return 'formatted code';
            });
            prettierService.prettify('', (err: Error, formattedCode: string) => {
                expect(err).toBeFalsy();
                expect(formattedCode).toEqual('formatted code');
            });
        });
    });
});
