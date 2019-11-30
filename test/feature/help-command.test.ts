import { execSync } from 'child_process';
import {ASCII_ART, PACKAGE_NAME} from '../../src/constants';

describe('help command', () => {
    let appName: string;

    beforeAll(() => {
        appName = `${Date.now()}my-app`;
        if (process.env.TEST_ENV === 'CI') {
            execSync('sudo npm install -g create-react-app');
        }
        execSync('yarn build');
    });

    afterAll(() => {
        execSync(`rm -rf ./${appName}`);
    });

    beforeEach(() => {
        execSync(`rm -rf ./${appName}`);
    });

    describe('when I enter help command', () => {
        it('shows the help', () => {
            const command = PACKAGE_NAME +
                ' --help';
            const result = execSync(command);
            expect(result.toString()).toContain(ASCII_ART.HELP);
        });
    });

    describe('when I use alias -h', () => {
        it('shows the help', () => {
            const command = PACKAGE_NAME +
                ' -h';
            const result = execSync(command);
            expect(result.toString()).toContain(ASCII_ART.HELP);
        });
    });
});
