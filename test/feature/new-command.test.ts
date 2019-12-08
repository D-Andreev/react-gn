import { spawn, execSync } from 'child_process';
import {EOL} from 'os';
import fs from 'fs';
import {ASCII_ART, PACKAGE_NAME} from '../../src/constants';
import {buildPackage} from './utils';

function verifyAppIsCreated(appName: string) {
    execSync(`cd ${appName} && npm install && npm run build`);
}

describe('new command', () => {
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

    describe('when I do not enter app name', () => {
        it('shows the help', () => {
            const result = execSync(`${PACKAGE_NAME} new`);
            expect(result.toString()).toContain(ASCII_ART.HELP);
        });
    });

    describe('when I say yes to every question', () => {
        beforeAll(() => {
            appName = `${Date.now()}my-app`;
        });
        afterAll(() => {
            execSync(`rm -rf ./${appName}`);
        });

        it('creates an ejected app with redux and typescript', (done) => {
            console.log('asdasd')
            // execSync('git stash && git clean -fd');
            const command =
                `${PACKAGE_NAME} new ${appName}`;
            const cmd = spawn(command);
            let result = '';
            console.log('as')
            cmd.on('open', () => {
                console.log('on open')
                cmd.stdin.write(`y${EOL}`);
            });
            cmd.on('data', (data: Buffer) => {
                result += data.toString();
                console.log('a', data.toString())
            });
            cmd.on('error', (err: ErrorEvent) => {
                console.log(err);
                done(err);
            });
            cmd.on('end', () => {
                expect(result.toString()).toContain(`${appName} was generated successfully!`);
                expect(fs.existsSync(`./${appName}/package.json`)).toBeTruthy();
                expect(fs.existsSync(`./${appName}/tsconfig.json`)).toBeTruthy();
                expect(fs.existsSync(`./${appName}/scripts/build.js`)).toBeTruthy();
                execSync('npm run build');
                done();
            });
        });
    });
});
