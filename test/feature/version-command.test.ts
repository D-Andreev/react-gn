import { execSync } from 'child_process';
import {SDK_NAME} from '../../src/constants';

describe('version command', () => {
    beforeAll(() => {
        execSync('yarn build');
    });

    describe('when I enter react-sdk --version', () => {
        it('shows the version', () => {
            const result = execSync(`${SDK_NAME} --version`);
            expect(result.toString()).toContain('Version: ');
        });
    });
});
