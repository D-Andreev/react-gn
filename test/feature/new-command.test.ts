import { spawn, execSync } from 'child_process';
import {EOL} from 'os';
import fs from 'fs';
import {ASCII_ART, PACKAGE_NAME, QUESTION} from '../../src/constants';
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
    let answerCounter = 0;
    let currentQuestion = Object.keys(answers)[answerCounter];
    let currentAnswer = answers[currentQuestion];
    const child = spawn(PACKAGE_NAME, ['new', appName], {shell: true});
    child.stdin.setDefaultEncoding('utf8');
    child.stdout.on('data', (data) => {
        if (currentQuestion && data.toString().indexOf(currentQuestion) >= 0) {
            child.stdin.write(Buffer.from(currentAnswer), 'utf8');
            currentQuestion = Object.keys(answers)[++answerCounter];
            currentAnswer = answers[currentQuestion];
        }
        data.toString().indexOf(`${appName} has been created successfully!`);
        if (data.toString().indexOf(`${appName} has been created successfully!`) >= 0) {
            done();
        }
    });
}

describe('new command', () => {
    let appName: string;
    beforeAll(() => {
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
            execSync(`rm -rf ./${appName}`);
        });

        it('does not apply any of the configurations', (done) => {
            createNewApp(appName,{
                [QUESTION.TS]: `n${EOL}`,
                [QUESTION.REDUX]: `n${EOL}`,
                [QUESTION.EJECTED]: `n${EOL}`,
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
            execSync(`rm -rf ./${appName}`);
        });

        it('does not apply any of the configurations', (done) => {
            createNewApp(appName,{
                [QUESTION.TS]: `${EOL}`,
                [QUESTION.REDUX]: `${EOL}`,
                [QUESTION.EJECTED]: `${EOL}`,
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
            execSync(`rm -rf ./${appName}`);
        });

        it('sets up all the configurations', (done) => {
            createNewApp(appName,{
                [QUESTION.TS]: `y${EOL}`,
                [QUESTION.REDUX]: `yes${EOL}`,
                [QUESTION.EJECTED]: `y${EOL}`,
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
});
