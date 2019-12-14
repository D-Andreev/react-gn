import { spawn, execSync } from 'child_process';
import {EOL} from 'os';
import fs from 'fs';
import {
    ASCII_ART,
    COMMAND_FLAG,
    FLAGS_WITH_TEMPLATES,
    NEW_COMMAND_QUESTION_MESSAGES,
    PACKAGE_NAME
} from '../../src/constants';
import {buildPackage} from './utils';

const TIMEOUT = 60000 * 3;

function verifyAppIsCreated(appName: string) {
    expect(fs.existsSync(`./${appName}/package.json`)).toBeTruthy();
    execSync('npm run build');
}

function createNewApp(appName: string, answers: any, done: Function) {
    if (process.env.TEST_ENV === 'CI') {
        execSync('git stash && git clean -fd');
    }
    execSync(`${PACKAGE_NAME} new ${appName} -i false ${answers[0] ? COMMAND_FLAG.TS : ''}` +
    `${answers[1] ? FLAGS_WITH_TEMPLATES.WITH_REDUX : ''} ${answers[2] ? COMMAND_FLAG.EJECTED : ''}`);
}

describe('new command', () => {
    let appName: string;
    let disableInteractive: string;
    beforeAll(() => {
        disableInteractive = '-i false';
        appName = `${Date.now()}my-app`;
        buildPackage();
    });

    afterAll(() => {
        execSync(`rm -rf ./${appName}`);
    });

    beforeEach(() => {
        execSync(`rm -rf ./${appName}`);
    });

    describe('when I do not enter app name', () => {
        it('shows the help', () => {
            const result = execSync(`${PACKAGE_NAME} new`);
            expect(result.toString()).toContain(ASCII_ART.HELP);
        });
    });

    describe('when I answer "no" to every question', () => {
        beforeAll(() => {
            appName = `${Date.now()}my-app`;
        });
        afterAll(() => {
            execSync(`rm -rf ./${appName} ${disableInteractive}`);
        });

        it('does not apply any of the configurations', (done) => {
            createNewApp(appName,{
                [NEW_COMMAND_QUESTION_MESSAGES.USE_TS]: false,
                [NEW_COMMAND_QUESTION_MESSAGES.USE_REDUX]: false,
                [NEW_COMMAND_QUESTION_MESSAGES.EJECT_APP]: false,
            }, (err: ErrorEvent) => {
                if (err) {
                    return done(err);
                }

                verifyAppIsCreated(appName);
                done();
            });
        }, TIMEOUT);
    });

    describe('when I press enter for all of the questions', () => {
        beforeAll(() => {
            appName = `${Date.now()}my-app`;
        });
        afterAll(() => {
            execSync(`rm -rf ./${appName} ${disableInteractive}`);
        });

        it('does not apply any of the configurations', (done) => {
            createNewApp(appName,{
                [NEW_COMMAND_QUESTION_MESSAGES.USE_TS]: `${EOL}`,
                [NEW_COMMAND_QUESTION_MESSAGES.USE_REDUX]: `${EOL}`,
                [NEW_COMMAND_QUESTION_MESSAGES.EJECT_APP]: `${EOL}`,
            }, (err: ErrorEvent) => {
                if (err) {
                    return done(err);
                }

                verifyAppIsCreated(appName);
                done();
            });
        }, TIMEOUT);
    });

    describe('when I answer "yes" to everything', () => {
        beforeAll(() => {
            appName = `${Date.now()}my-app`;
        });
        afterAll(() => {
            execSync(`rm -rf ./${appName} ${disableInteractive}`);
        });

        it('sets up all the configurations', (done) => {
            createNewApp(appName,{
                [NEW_COMMAND_QUESTION_MESSAGES.USE_TS]: `y${EOL}`,
                [NEW_COMMAND_QUESTION_MESSAGES.USE_REDUX]: `yes${EOL}`,
                [NEW_COMMAND_QUESTION_MESSAGES.EJECT_APP]: `y${EOL}`,
            }, (err: ErrorEvent) => {
                if (err) {
                    return done(err);
                }

                expect(fs.existsSync(`./${appName}/tsconfig.json`)).toBeTruthy();
                expect(fs.existsSync(`./${appName}/scripts/build.js`)).toBeTruthy();
                verifyAppIsCreated(appName);
                done();
            });
        }, TIMEOUT);
    });

    describe('when I answer "yes" only to eject the app', () => {
        beforeAll(() => {
            appName = `${Date.now()}my-app`;
        });
        afterAll(() => {
            execSync(`rm -rf ./${appName} ${disableInteractive}`);
        });

        it('sets up all the configurations', (done) => {
            createNewApp(appName,{
                [NEW_COMMAND_QUESTION_MESSAGES.USE_TS]: `n${EOL}`,
                [NEW_COMMAND_QUESTION_MESSAGES.USE_REDUX]: `${EOL}`,
                [NEW_COMMAND_QUESTION_MESSAGES.EJECT_APP]: `y${EOL}`,
            }, (err: ErrorEvent) => {
                if (err) {
                    return done(err);
                }

                expect(fs.existsSync(`./${appName}/tsconfig.json`)).toBeFalsy();
                expect(fs.existsSync(`./${appName}/scripts/build.js`)).toBeTruthy();
                verifyAppIsCreated(appName);
                done();
            });
        }, TIMEOUT);
    });
});
