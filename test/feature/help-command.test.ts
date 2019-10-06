import { execSync } from 'child_process';
import {ASCII_ART, SDK_NAME} from '../../src/constants';

describe('help command', () => {
    let appName: string;

    beforeAll(() => {
        appName = `${Date.now()}my-app`;
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
            const command = SDK_NAME +
                ' --help';
            const result = execSync(command);
            expect(result.toString()).toContain(ASCII_ART.HELP);
        });
    });
});
