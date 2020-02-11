import { execSync } from 'child_process';
import * as fs from 'fs';
import {
    ASCII_ART,
    PACKAGE_NAME
} from '../../src/constants';
import {buildPackage} from './utils';

const TIMEOUT = 60000 * 3;

function verifyAppIsCreated(appName: string) {
    expect(fs.existsSync(`./${appName}/package.json`)).toBeTruthy();
    execSync('npm run build');
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
        if (process.env.TEST_ENV === 'CI') {
            execSync('git stash && git clean -fd');
        }
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

        it('does not apply any of the configurations', () => {
            execSync(`${PACKAGE_NAME} new ${appName} -i false`);
            verifyAppIsCreated(appName);
        }, TIMEOUT);
    });

    describe('when I answer "yes" to everything', () => {
        beforeAll(() => {
            appName = `${Date.now()}my-app`;
        });
        afterAll(() => {
            execSync(`rm -rf ./${appName} ${disableInteractive}`);
        });

        it('sets up all the configurations', () => {
            execSync(`${PACKAGE_NAME} new ${appName} -i false --ts -wr -e`);
            verifyAppIsCreated(appName);
        }, TIMEOUT);
    });

    describe('when I answer "yes" only to eject the app', () => {
        beforeAll(() => {
            appName = `${Date.now()}my-app`;
        });
        afterAll(() => {
            execSync(`rm -rf ./${appName} ${disableInteractive}`);
        });

        it('sets up all the configurations', () => {
            execSync(`${PACKAGE_NAME} new ${appName} -i false -e`);
            verifyAppIsCreated(appName);
        }, TIMEOUT);
    });
});
