import { execSync } from 'child_process';
import {ASCII_ART, SDK_NAME} from '../../src/constants';

describe('help command', () => {
    beforeAll(() => {
        execSync('yarn build');
    });

    describe('when I enter help command', () => {
        it('shows the help', () => {
            const command = SDK_NAME +
                ' --help';
            const result = execSync(command);
            expect(result.toString()).toContain(ASCII_ART.HELP);
        });
    });

    describe('when I enter main command and help', () => {
        it('executes the command and does not show the help', () => {
            const command = SDK_NAME +
                ' init myApp --js --help';
            const result = execSync(command);
            expect(result.toString()).toContain('JS APP COMMAND');
        });
    });
});
