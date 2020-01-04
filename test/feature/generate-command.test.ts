import { execSync } from 'child_process';
import * as fs from 'fs';
import {
    PACKAGE_NAME
} from '../../src/constants';
import {buildPackage} from './utils';

function verifyComponentIsCreated(componentName: string, isJs = true) {
    expect(fs.existsSync(`./${componentName}/${componentName}.${isJs ? 'jsx' : 'tsx'}`)).toBeTruthy();
    expect(fs.existsSync(`./${componentName}/${componentName}.test.${isJs ? 'js' : 'ts'}`)).toBeTruthy();
}

describe('generate command', () => {
    let componentDirName: string;
    let componentName: string;
    beforeAll(() => {
        componentName = 'MyCounter';
        componentDirName = 'my-counter';
        buildPackage();
    });

    afterEach(() => {
        execSync(`rm -rf ./${componentDirName}`);
    });

    describe('when I use all the default options', () => {
        it('creates a javascript functional component in the same directory', () => {
            const result =
                execSync(`${PACKAGE_NAME} generate -i false --path ./ --dirName ${componentDirName}`);
            expect(result.toString()).toContain(`${componentDirName} was created successfully!`);
            verifyComponentIsCreated(componentDirName);
        });
    });

    describe('when I choose to create a functional component with all options', () => {
        it('creates all files for the component', () => {
            const result =
                execSync(`${PACKAGE_NAME} generate -i false --path ./ --dirName ${componentDirName}` +
                    ' --withHooks --withPropTypes --withCss');
            expect(result.toString()).toContain(`${componentDirName} was created successfully!`);
            verifyComponentIsCreated(componentDirName);
            expect(fs.existsSync(`./${componentDirName}/${componentDirName}.styles.css`)).toBeTruthy();
        });
    });

    describe('when I create a class component with no additional options', () => {
        it('creates a bare class component', () => {
            const result =
                execSync(`${PACKAGE_NAME} generate -i false --path ./ --dirName ${componentDirName} --isClass`);
            expect(result.toString()).toContain(`${componentDirName} was created successfully!`);
            verifyComponentIsCreated(componentDirName);
        });
    });

    describe('when I create a class component with all options', () => {
        it('creates a class component with all options', () => {
            const result =
                execSync(`${PACKAGE_NAME} generate -i false --path ./ --dirName ${componentDirName}` +
                    ' --withHooks --withRedux --withPropTypes --isClass  --withCss');
            expect(result.toString()).toContain(`${componentDirName} was created successfully!`);
            verifyComponentIsCreated(componentDirName);
            expect(fs.existsSync(`./${componentDirName}/${componentDirName}.styles.css`)).toBeTruthy();
        });
    });

    describe('when I create a class component with typescript and no additional options', () => {
        it('creates a bare class component with typescript', () => {
            const result =
                execSync(`${PACKAGE_NAME} generate -i false --path ./ --dirName ${componentDirName} --isClass --ts`);
            expect(result.toString()).toContain(`${componentDirName} was created successfully!`);
            verifyComponentIsCreated(componentDirName);
        });
    });

    describe('when I create a class component with all options', () => {
        it('creates a class component with all options', () => {
            const result =
                execSync(`${PACKAGE_NAME} generate -i false --path ./ --dirName ${componentDirName}` +
                    ' --withState --withRedux --withStyledComponents --isClass --ts');
            expect(result.toString()).toContain(`${componentDirName} was created successfully!`);
            verifyComponentIsCreated(componentDirName);
            expect(fs.existsSync(`./${componentDirName}/Styled${componentDirName}.js`)).toBeTruthy();
        });
    });
});
