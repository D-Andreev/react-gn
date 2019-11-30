import { execSync } from 'child_process';
import {SDK_NAME} from '../../src/constants';

describe('version command', () => {
    beforeAll(() => {
        execSync('yarn build');
        if (process.env.TEST_ENV === 'CI') {
            execSync('sudo npm install -g create-react-app');
        }
    });

    describe('when I enter react-sdk --version', () => {
        it('shows the version', () => {
            const result = execSync(`${SDK_NAME} --version`);
            expect(result.toString()).toContain('Version: ');
        });
    });

    describe('when I use alias -v', () => {
        it('shows the version', () => {
            const result = execSync(`${SDK_NAME} --v`);
            expect(result.toString()).toContain('Version: ');
        });
    });
});
