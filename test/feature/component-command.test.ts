import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import {buildPackage} from './utils';
import {NEW_COMPONENT_MESSAGE} from '../../src/constants';

function assertBasicComponentIsCreated(componentName: string, dirPath: string = './'): void {
    fs.existsSync(path.join(dirPath, componentName));
    fs.existsSync(path.join(dirPath, componentName, `${componentName}.js`));
    fs.existsSync(path.join(dirPath, componentName, `${componentName}.css`));
    fs.existsSync(path.join(dirPath, componentName, `${componentName}.test.js`));
    execSync(`cd ${dirPath} && npm build`);
}

describe('component command', () => {
    let componentName: string;
    let myDir: string;
    let containerTemplate: string;
    beforeAll(() => {
        buildPackage();
        componentName = 'testComponent';
        myDir = './myDir';
        containerTemplate = './demos/with-templates/templates/container';
    });

    afterAll(() => {
        execSync(`rm -rf ./${componentName}`);
    });

    beforeEach(() => {
        execSync(`rm -rf ./${componentName}`);
    });

    afterEach(() => {
        execSync(`rm -rf ${myDir}`);
    });

    describe('when I do not provide component name', () => {
        it('shows an error message', () => {
            const result = execSync(`react-sdk component`);
            expect(result).toContain(NEW_COMPONENT_MESSAGE.INVALID_NAME);
        });
    });

    describe('when I provide component name', () => {
        describe('when I do not provide path', () => {
            it('creates the component in the current directory', () => {
                const result = execSync(`react-sdk component --name=${componentName} ` +
                `--template=${containerTemplate}`
                );
                expect(result).toContain(NEW_COMPONENT_MESSAGE.CREATE_SUCCESS);
                assertBasicComponentIsCreated(componentName);
            });
        });

        describe('when I provide path', () => {
            describe('when the target path does not exist', () => {
                it('shows an error message', () => {
                    const result =
                        execSync(`react-sdk component --name=${componentName} --path=./invalid-dir`);
                    expect(result).toContain(NEW_COMPONENT_MESSAGE.INVALID_PATH);
                });
            });

            describe('when the target path exists', () => {
                describe('when template path is not provided', () => {
                    it('shows an error message', () => {
                        fs.mkdirSync(myDir);
                        const result = execSync(
                            `react-sdk component --name=${componentName} --path=${myDir}`
                        );
                        expect(result).toContain(NEW_COMPONENT_MESSAGE.INVALID_TEMPLATE_PATH);
                    });
                });

                describe('when template path is provided', () => {
                    it('creates the component in the provided directory', () => {
                        fs.mkdirSync(myDir);
                        const result = execSync(
                            `react-sdk component --name=${componentName} --path=${myDir} ` +
                            `--template=${containerTemplate}` +
                            ``
                        );
                        expect(result).toContain(NEW_COMPONENT_MESSAGE.CREATE_SUCCESS);

                        assertBasicComponentIsCreated(componentName);
                    });
                });
            });
        });
    });
});
