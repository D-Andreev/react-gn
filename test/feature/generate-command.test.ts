import { execSync } from 'child_process';
import * as fs from 'fs';
import {
    PACKAGE_NAME
} from '../../src/constants';
import {buildPackage} from './utils';

function verifyComponentIsCreated(output: Buffer, componentDirName: string, componentName: string, isJs = true) {
    expect(output.toString()).toContain(`${componentName} was created successfully!`);
    expect(fs.existsSync(`./${componentDirName}/${componentName}.${isJs ? 'jsx' : 'tsx'}`)).toBeTruthy();
    expect(fs.existsSync(`./${componentDirName}/${componentName}.test.${isJs ? 'js' : 'ts'}`)).toBeTruthy();
}

describe('generate command', () => {
    let componentDirName: string;
    let componentName: string;
    beforeAll(() => {
        componentName = 'MyCounter';
        componentDirName = 'my-counter';
        buildPackage();
        execSync(`rm -rf ./${componentDirName}`);
    });

    afterEach(() => {
        execSync(`rm -rf ./${componentDirName}`);
    });

    describe('when I use all the default options', () => {
        it('creates a javascript functional component in the same directory', () => {
            const result =
                execSync(`${PACKAGE_NAME} generate -i false --path ./ --dirName ${componentDirName}`);
            verifyComponentIsCreated(result, componentDirName, componentName);
        });
    });

    describe('when I choose to create a functional component with all options', () => {
        it('creates all files for the component', () => {
            const result =
                execSync(`${PACKAGE_NAME} generate -i false --path ./ --dirName ${componentDirName}` +
                    ' --withHooks --withPropTypes --withCss');

            verifyComponentIsCreated(result, componentDirName, componentName);
            expect(fs.existsSync(`./${componentDirName}/${componentName}.styles.css`)).toBeTruthy();
        });
    });

    describe('when I create a class component with no additional options', () => {
        it('creates a bare class component', () => {
            const result =
                execSync(`${PACKAGE_NAME} generate -i false --path ./ --dirName ${componentDirName} --isClass`);
            verifyComponentIsCreated(result, componentDirName, componentName);
        });
    });

    describe('when I create a class component with all options', () => {
        it('creates a class component with all options', () => {
            const result =
                execSync(`${PACKAGE_NAME} generate -i false --path ./ --dirName ${componentDirName}` +
                    ' --withHooks --withPropTypes --isClass  --withCss');
            verifyComponentIsCreated(result, componentDirName, componentName);
            expect(fs.existsSync(`./${componentDirName}/${componentName}.styles.css`)).toBeTruthy();
        });
    });

    describe('when I create a class component with typescript and no additional options', () => {
        it('creates a bare class component with typescript', () => {
            const result =
                execSync(`${PACKAGE_NAME} generate -i false --path ./ --dirName ${componentDirName} --isClass --ts`);
            verifyComponentIsCreated(result, componentDirName, componentName);
        });
    });

    describe('when I create a class component with all options', () => {
        it('creates a class component with all options', () => {
            const result =
                execSync(`${PACKAGE_NAME} generate -i false --path ./ --dirName ${componentDirName}` +
                    ' --withState --withStyledComponents --isClass --ts');
            verifyComponentIsCreated(result, componentDirName, componentName);
            expect(fs.existsSync(`./${componentDirName}/Styled${componentName}.js`)).toBeTruthy();
        });
    });
});
