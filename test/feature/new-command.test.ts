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
            const result = spawn(PACKAGE_NAME, ['new', appName], {shell: true});
            result.stdin.setDefaultEncoding('utf8');
            result.stdout.on('data', (data) => {
                console.log(data.toString())
                if (data.toString().indexOf('Do yo') >= 0) {
                    console.log('answering...')
                    result.stdin.write(Buffer.from(`n${EOL}`), 'utf8');
                }
            })
            result.stderr.on('data', (err) => {
                console.log('err', err)
            })
            result.on('close', () => {
                console.log('close')
                expect(fs.existsSync(`./${appName}/package.json`)).toBeTruthy();
                done();
            })
            /*expect(result.toString()).toContain(`${appName} was generated successfully!`);
            expect(fs.existsSync(`./${appName}/package.json`)).toBeTruthy();
            expect(fs.existsSync(`./${appName}/tsconfig.json`)).toBeTruthy();
            expect(fs.existsSync(`./${appName}/scripts/build.js`)).toBeTruthy();
            execSync('npm run build');
            done();*/
        });
    });
});
