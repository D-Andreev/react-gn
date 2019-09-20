import { execSync } from 'child_process';
import {SDK_NAME} from '../../src/constants';

describe('init command', () => {
    beforeAll(() => {
        execSync('yarn build');
    });

    describe('when I enter incorrect package name', () => {
        it('throws an error', () => {
            expect(() => {
                execSync('invalid-react-sdk-name init myApp');
            }).toThrow();
        });
    });

    describe('when I enter correct package name', () => {
        describe('when I enter invalid main command', () => {
            it('shows the help', () => {
                const result = execSync(`${SDK_NAME} invalid-main-command`);
                expect(result.toString()).toContain('HELP');
            });
        });

        describe('when I do not enter app name', () => {
            it('shows the help', () => {
                const result = execSync(`${SDK_NAME} init`);
                expect(result.toString()).toContain('HELP');
            });
        });

        describe('when I do not enter language type', () => {
            it('creates js language type app', () => {
                const result = execSync(`${SDK_NAME} init myAPp`);
                expect(result.toString()).toContain('JS APP COMMAND');
            });
        });

        describe('when I enter --js', () => {
            it('creates js language type app', () => {
                const result = execSync(`${SDK_NAME} init myAPp --js`);
                expect(result.toString()).toContain('JS APP COMMAND');
            });
        });

        describe('when I enter --ts', () => {
            it('creates ts language type app', () => {
                const result = execSync(`${SDK_NAME} init myAPp --ts`);
                expect(result.toString()).toContain('TS APP COMMAND');
            });
        });
    });
});
