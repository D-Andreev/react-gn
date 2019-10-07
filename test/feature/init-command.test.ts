import { execSync } from 'child_process';
import fs from 'fs';
import {ASCII_ART, SDK_NAME} from '../../src/constants';

describe('init command', () => {
    let appName: string;
    beforeAll(() => {
        appName = `${Date.now()}my-app`;
        execSync('yarn build');
    });

    afterAll(() => {
        execSync(`rm -rf ./${appName}`);
    });

    beforeEach(() => {
        execSync(`rm -rf ./${appName}`);
    });

    describe('when I enter incorrect package name', () => {
        it('throws an error', () => {
            expect(() => {
                execSync(`invalid-react-sdk-name init ${appName}`);
            }).toThrow();
        });
    });

    describe('when I enter correct package name', () => {
        describe('when I enter invalid main command', () => {
            it('shows the help', () => {
                const result = execSync(`${SDK_NAME} invalid-main-command`);
                expect(result.toString()).toContain(ASCII_ART.HELP);
            });
        });

        describe('when I do not enter app name', () => {
            it('shows the help', () => {
                const result = execSync(`${SDK_NAME} init`);
                expect(result.toString()).toContain(ASCII_ART.HELP);
            });
        });

        describe('when I do not enter language type', () => {
            let appName: string;
            beforeAll(() => {
                appName = `${Date.now()}my-app`;
            });
            afterAll(() => {
                execSync(`rm -rf ./${appName}`);
            });

            it('creates js language type app', () => {
                const result = execSync(`${SDK_NAME} init ${appName}`);
                expect(result.toString()).toContain(`${appName} was generated successfully!`);
                expect(fs.existsSync(`./${appName}/package.json`)).toBeTruthy();
            });
        });

        describe('when I enter --js', () => {
            let appName: string;
            beforeAll(() => {
                appName = `${Date.now()}my-app`;
            });
            afterAll(() => {
                execSync(`rm -rf ./${appName}`);
            });

            it('creates js language type app', () => {
                const result = execSync(`${SDK_NAME} init ${appName} --js`);
                expect(result.toString()).toContain(`${appName} was generated successfully!`);
                expect(fs.existsSync(`./${appName}/package.json`)).toBeTruthy();
            });
        });

        describe('when I enter --ts', () => {
            let appName: string;
            beforeAll(() => {
                appName = `${Date.now()}my-app`;
            });
            afterAll(() => {
                execSync(`rm -rf ./${appName}`);
            });

            it('creates ts language type app', () => {
                const result = execSync(`${SDK_NAME} init ${appName} --ts`);
                expect(result.toString()).toContain(`${appName} was generated successfully!`);
                expect(fs.existsSync(`./${appName}/package.json`)).toBeTruthy();
                expect(fs.existsSync(`./${appName}/tsconfig.json`)).toBeTruthy();
            });
        });

        describe('when I enter --unknown-flag some-value --ts some-other-unknown-flag some-other-value', () => {
            let appName: string;
            beforeAll(() => {
                appName = `${Date.now()}my-app`;
            });
            afterAll(() => {
                execSync(`rm -rf ./${appName}`);
            });

            it('omits the unknown flags', () => {
                const command =
                    `${SDK_NAME} init ${appName} --unknown-flag some-value --ts some-other-unknown-flag some-other-value`;
                const result = execSync(command);
                expect(result.toString()).toContain(`${appName} was generated successfully!`);
                expect(fs.existsSync(`./${appName}/package.json`)).toBeTruthy();
                expect(fs.existsSync(`./${appName}/tsconfig.json`)).toBeTruthy();
            });
        });

        describe('when I enter multiple language types', () => {
            let appName: string;
            beforeAll(() => {
                appName = `${Date.now()}my-app`;
            });
            afterAll(() => {
                execSync(`rm -rf ./${appName}`);
            });

            it('considers only the first one', () => {
                const command =
                    `${SDK_NAME} init ${appName} --unknown-flag some-value --ts --js some-other-unknown-flag -js some-other-value`;
                const result = execSync(command);
                expect(result.toString()).toContain(`${appName} was generated successfully!`);
                expect(fs.existsSync(`./${appName}/package.json`)).toBeTruthy();
                expect(fs.existsSync(`./${appName}/tsconfig.json`)).toBeTruthy();
            });
        });

        describe('when I enter --ejected', () => {
            let appName: string;
            beforeAll(() => {
                appName = `${Date.now()}my-app`;
            });

            it('it ejects the app', () => {
                const command =
                    `${SDK_NAME} init ${appName} --ejected`;
                const result = execSync(command);
                expect(result.toString()).toContain(`${appName} was generated successfully!`);
                expect(fs.existsSync(`./${appName}/package.json`)).toBeTruthy();
                expect(fs.existsSync(`./${appName}/scripts/build.js`)).toBeTruthy();
            });
        });

        describe('when I enter --ejected --ts', () => {
            let appName: string;
            beforeAll(() => {
                appName = `${Date.now()}my-app`;
            });

            it('it builds a ts app and ejects it', () => {
                const command =
                    `${SDK_NAME} init ${appName} --ejected --ts`;
                const result = execSync(command);
                expect(result.toString()).toContain(`${appName} was generated successfully!`);
                expect(fs.existsSync(`./${appName}/package.json`)).toBeTruthy();
                expect(fs.existsSync(`./${appName}/tsconfig.json`)).toBeTruthy();
                expect(fs.existsSync(`./${appName}/scripts/build.js`)).toBeTruthy();
            });
        });
    });
});
