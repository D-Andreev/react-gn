import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import {buildPackage} from './utils';
import {ASCII_ART, NEW_COMPONENT_MESSAGE, PACKAGE_NAME} from '../../src/constants';

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
        componentName = 'myPosts';
        myDir = './myDir';
        containerTemplate = path.join(process.cwd(), 'demos', 'js', 'with-templates', 'src', 'containers');
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
        it('shows the help', () => {
            const result = execSync(`${PACKAGE_NAME} component`);
            expect(result.toString()).toContain(ASCII_ART.HELP);
        });
    });

    describe('when I provide component name', () => {
        describe('when template path is not provided', () => {
            it('shows an error message', () => {
                fs.mkdirSync(myDir);
                const result = execSync(
                    `cd ${myDir} && ${PACKAGE_NAME} component --name ${componentName}`
                );
                expect(result.toString()).toContain(NEW_COMPONENT_MESSAGE.INVALID_TEMPLATE_PATH);
            });
        });

        describe('when template path is provided', () => {
            it('creates the component in the provided directory', () => {
                fs.mkdirSync(myDir);
                const result = execSync(
                    `cd ${myDir} && ${PACKAGE_NAME} component ` +
                    `--name ${componentName} ` +
                    `--template ${containerTemplate} ` +
                    '--component posts ' +
                    '--reducer myPostsReducer ' +
                    '--action postsActions ' +
                    '--state posts,isLoadingPosts'
                );
                assertBasicComponentIsCreated(componentName);
                fs.existsSync(
                    path.join('./', componentName, 'reducers', 'myPostsReducer', 'myPostsReducer.js'));
                fs.existsSync(
                    path.join('./', componentName, 'actions', 'postsActions', 'postsActions.js'));
            });

            describe('when I use a different path separator', () => {
                it('creates the component in the provided directory', () => {
                    fs.mkdirSync(myDir);
                    const result = execSync(
                        `cd ${myDir} && ${PACKAGE_NAME} component ` +
                        `--name ${componentName} ` +
                        '--template  .\\containers' +
                        '--component posts ' +
                        '--reducer myPostsReducer ' +
                        '--action postsActions ' +
                        '--state posts,isLoadingPosts'
                    );
                    assertBasicComponentIsCreated(componentName);
                    fs.existsSync(
                        path.join('./', componentName, 'reducers', 'myPostsReducer', 'myPostsReducer.js'));
                    fs.existsSync(
                        path.join('./', componentName, 'actions', 'postsActions', 'postsActions.js'));
                });
            });
        });
    });
});
