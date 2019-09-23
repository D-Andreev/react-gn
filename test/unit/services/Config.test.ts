import Config from '../../../src/services/Config';
import IConfig from '../../../src/services/interfaces/IConfig';
import {DEFAULT_CONFIG} from '../../../src/constants';
import IConfigOptions from '../../../src/services/interfaces/IConfigOptions';

describe('Config', () => {
    let config: IConfig;

    beforeEach(() => {
        config = new Config([]);
    });

    describe('getOptions', () => {
        describe('when no flags are passed', () => {
            it('creates the default config', (done) => {
                config.getOptions((err: any, options: IConfigOptions) => {
                    expect(err).toBeNull();
                    expect(options).toEqual(DEFAULT_CONFIG);
                    done();
                });
            });
        });

        describe('when flags are passed', () => {
            it('creates the correct config', (done) => {
                config = new Config([
                    { name: 'test', value: 'val'},
                    { name: 'test2', value: 'val2'},
                ]);
                config.getOptions((err: any, options: IConfigOptions) => {
                    expect(err).toBeNull();
                    expect(options).toEqual({...DEFAULT_CONFIG, 'test': 'val', 'test2': 'val2'});
                    done();
                });
            });
        });
    });

    describe('getOption', () => {
        describe('when option does not exist', () => {
            it('yields error', () => {
                config.getOption('unknown-option', (err: any) => {
                    expect(err).toBeTruthy();
                    expect(err instanceof Error).toBe(true);
                });
            });
        });

        describe('when option exists', () => {
            it('yields the option', () => {
                config.getOption('language', (err: any, res: any) => {
                    expect(err).toBeNull();
                    expect(res).toEqual(DEFAULT_CONFIG.language);
                });
            });
        });
    });

    describe('setOption', () => {
        it('sets the option', () => {
            config.setOption('test', 'test', (err: any, res: any) => {
                expect(err).toBeNull();
                expect(res).toEqual('test');
            });
        });
    });
});
