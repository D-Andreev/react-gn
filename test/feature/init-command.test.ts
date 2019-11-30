import { execSync } from 'child_process';
import fs from 'fs';
import {ASCII_ART, PACKAGE_NAME} from '../../src/constants';
import {buildPackage} from './utils';

describe('init command', () => {
    let appName: string;
    beforeAll(() => {
        buildPackage();
        appName = `${Date.now()}my-app`;
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
                execSync(`invalid-react-gn-name init ${appName}`);
            }).toThrow();
        });
    });

    describe('when I enter correct package name', () => {
        describe('when I enter invalid main command', () => {
            it('shows the help', () => {
                const result = execSync(`${PACKAGE_NAME} invalid-main-command`);
                expect(result.toString()).toContain(ASCII_ART.HELP);
            });
        });

        describe('when I do not enter app name', () => {
            it('shows the help', () => {
                const result = execSync(`${PACKAGE_NAME} init`);
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
                const result = execSync(`${PACKAGE_NAME} init ${appName}`);
                expect(result.toString()).toContain(`${appName} was generated successfully!`);
                expect(fs.existsSync(`./${appName}/package.json`)).toBeTruthy();
                execSync(`cd ${appName} && npm run build`);
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
                const result = execSync(`${PACKAGE_NAME} init ${appName} --js`);
                expect(result.toString()).toContain(`${appName} was generated successfully!`);
                expect(fs.existsSync(`./${appName}/package.json`)).toBeTruthy();
                execSync(`cd ${appName} && npm run build`);
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
                const result = execSync(`${PACKAGE_NAME} init ${appName} --ts`);
                expect(result.toString()).toContain(`${appName} was generated successfully!`);
                expect(fs.existsSync(`./${appName}/package.json`)).toBeTruthy();
                expect(fs.existsSync(`./${appName}/tsconfig.json`)).toBeTruthy();
                execSync(`cd ${appName} && npm run build`);
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
                    `${PACKAGE_NAME} init ${appName} --unknown-flag some-value --ts some-other-unknown-flag some-other-value`;
                const result = execSync(command);
                expect(result.toString()).toContain(`${appName} was generated successfully!`);
                expect(fs.existsSync(`./${appName}/package.json`)).toBeTruthy();
                expect(fs.existsSync(`./${appName}/tsconfig.json`)).toBeTruthy();
                execSync(`cd ${appName} && npm run build`);
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
                    `${PACKAGE_NAME} init ${appName} --unknown-flag some-value --ts --js some-other-unknown-flag -js some-other-value`;
                const result = execSync(command);
                expect(result.toString()).toContain(`${appName} was generated successfully!`);
                expect(fs.existsSync(`./${appName}/package.json`)).toBeTruthy();
                expect(fs.existsSync(`./${appName}/tsconfig.json`)).toBeTruthy();
                execSync(`cd ${appName} && npm run build`);
            });
        });

        describe('when I enter --ejected', () => {
            let appName: string;
            beforeAll(() => {
                appName = `${Date.now()}my-app`;
            });
            afterAll(() => {
                execSync(`rm -rf ./${appName}`);
            });

            it('it ejects the app', () => {
                execSync('git stash && git clean -fd');
                const command =
                    `${PACKAGE_NAME} init ${appName} --ejected`;
                const result = execSync(command);
                expect(result.toString()).toContain(`${appName} was generated successfully!`);
                expect(fs.existsSync(`./${appName}/package.json`)).toBeTruthy();
                expect(fs.existsSync(`./${appName}/scripts/build.js`)).toBeTruthy();
                execSync('npm run build');
            });
        });

        describe('when I enter --ejected --ts', () => {
            let appName: string;
            beforeAll(() => {
                appName = `${Date.now()}my-app`;
            });
            afterAll(() => {
                execSync(`rm -rf ./${appName}`);
            });

            it('it builds a ts app and ejects it', () => {
                execSync('git stash && git clean -fd');
                const command =
                    `${PACKAGE_NAME} init ${appName} --ejected --ts`;
                const result = execSync(command);
                expect(result.toString()).toContain(`${appName} was generated successfully!`);
                expect(fs.existsSync(`./${appName}/package.json`)).toBeTruthy();
                expect(fs.existsSync(`./${appName}/tsconfig.json`)).toBeTruthy();
                expect(fs.existsSync(`./${appName}/scripts/build.js`)).toBeTruthy();
                execSync('npm run build');
            });
        });

        describe('when I enter --withRedux', () => {
            let appName: string;
            beforeAll(() => {
                appName = `${Date.now()}my-app`;
            });
            afterAll(() => {
                execSync(`rm -rf ./${appName}`);
            });

            it('it builds the app and adds redux', () => {
                execSync('git stash && git clean -fd');
                const command =
                    `${PACKAGE_NAME} init ${appName} --withRedux`;
                const result = execSync(command);
                expect(result.toString()).toContain(`${appName} was generated successfully!`);
                expect(fs.existsSync(`./${appName}/package.json`)).toBeTruthy();
                expect(fs.existsSync(`./${appName}/src/actions/simpleAction.js`)).toBeTruthy();
                expect(fs.existsSync(`./${appName}/src/reducers/simpleReducer.js`)).toBeTruthy();
                expect(fs.existsSync(`./${appName}/src/store.js`)).toBeTruthy();
                execSync(`cd ${appName} && npm run build`);
            });
        });

        describe('when I enter --withRedux --ejected', () => {
            let appName: string;
            beforeAll(() => {
                appName = `${Date.now()}my-app`;
            });
            afterAll(() => {
                execSync(`rm -rf ./${appName}`);
            });

            it('it builds the app, ejects it and adds redux', () => {
                execSync('git stash && git clean -fd');
                const command =
                    `${PACKAGE_NAME} init ${appName} --withRedux --ejected`;
                const result = execSync(command);
                expect(result.toString()).toContain(`${appName} was generated successfully!`);
                expect(fs.existsSync(`./${appName}/package.json`)).toBeTruthy();
                expect(fs.existsSync(`./${appName}/scripts/build.js`)).toBeTruthy();
                expect(fs.existsSync(`./${appName}/src/actions/simpleAction.js`)).toBeTruthy();
                expect(fs.existsSync(`./${appName}/src/reducers/simpleReducer.js`)).toBeTruthy();
                expect(fs.existsSync(`./${appName}/src/store.js`)).toBeTruthy();
                execSync(`cd ${appName} && npm run build`);
            });
        });

        describe('when I enter --withRedux --ts', () => {
            let appName: string;
            beforeAll(() => {
                appName = `${Date.now()}my-app`;
            });
            afterAll(() => {
                execSync(`rm -rf ./${appName}`);
            });

            it('it builds the app, ejects it and adds redux', () => {
                execSync('git stash && git clean -fd');
                const command =
                    `${PACKAGE_NAME} init ${appName} --withRedux --ts`;
                const result = execSync(command);
                expect(result.toString()).toContain(`${appName} was generated successfully!`);
                expect(fs.existsSync(`./${appName}/package.json`)).toBeTruthy();
                expect(fs.existsSync(`./${appName}/tsconfig.json`)).toBeTruthy();
                execSync(`cd ${appName} && npm run build`);
            });
        });

        describe('when I enter --withRedux --ts --ejected', () => {
            let appName: string;
            beforeAll(() => {
                appName = `${Date.now()}my-app`;
            });
            afterAll(() => {
                execSync(`rm -rf ./${appName}`);
            });

            it('it builds the app, ejects it and adds redux', () => {
                execSync('git stash && git clean -fd');
                const command =
                    `${PACKAGE_NAME} init ${appName} --withRedux --ts --ejected`;
                const result = execSync(command);
                expect(result.toString()).toContain(`${appName} was generated successfully!`);
                expect(fs.existsSync(`./${appName}/package.json`)).toBeTruthy();
                expect(fs.existsSync(`./${appName}/tsconfig.json`)).toBeTruthy();
                expect(fs.existsSync(`./${appName}/scripts/build.js`)).toBeTruthy();
                let a = false;
                try {
                    execSync(`cd ${appName} && npm run build`);
                } catch (e) {
                    a = true;
                    console.log(e);
                }
                if (a) {
                    throw new Error('asd');
                }
            });
        });
    });
});
