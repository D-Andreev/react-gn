import { execSync } from 'child_process';
import {CLI_NAME} from '../../src/constants';

describe('version command', () => {
    beforeAll(() => {
        execSync('yarn build');
        if (process.env.TEST_ENV === 'CI') {
            execSync('sudo npm install -g create-react-app');
        }
    });

    describe(`when I enter ${CLI_NAME} --version`, () => {
        it('shows the version', () => {
            const result = execSync(`${CLI_NAME} --version`);
            expect(result.toString()).toContain('Version: ');
        });
    });
});
