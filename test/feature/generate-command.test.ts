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
    let componentName: string;
    beforeAll(() => {
        componentName = 'MyCounter';
        buildPackage();
    });

    afterEach(() => {
        execSync(`rm -rf ./${componentName}`);
    });

    describe('when I do not use a template', () => {
        describe('when I use all the default options', () => {
            it('creates a javascript functional component in the same directory', () => {
                const result =
                    execSync(`${PACKAGE_NAME} generate -i false --path ./ --name ${componentName}`);
                expect(result.toString().indexOf(`${componentName} was created successfully!`));
                verifyComponentIsCreated(componentName);
            });
        });

        describe('when I choose to create a functional component with all options', () => {
            it('creates all files for the component', () => {
                const result =
                    execSync(`${PACKAGE_NAME} generate -i false --path ./ --name ${componentName}` +
                    ' --withHooks --withPropTypes --withStyledComponents --withCss');
                expect(result.toString().indexOf(`${componentName} was created successfully!`));
                verifyComponentIsCreated(componentName);
                expect(fs.existsSync(`./${componentName}/Styled${componentName}.js`)).toBeTruthy();
                expect(fs.existsSync(`./${componentName}/${componentName}.css`)).toBeTruthy();
            });
        });

        describe('when I create a class component with no additional options', () => {
            it('creates a bare class component', () => {
                const result =
                    execSync(`${PACKAGE_NAME} generate -i false --path ./ --name ${componentName} --isClass`);
                expect(result.toString().indexOf(`${componentName} was created successfully!`));
                verifyComponentIsCreated(componentName);
            });
        });

        describe('when I create a class component with all options', () => {
            it('creates a class component with all options', () => {
                const result =
                    execSync(`${PACKAGE_NAME} generate -i false --path ./ --name ${componentName}` +
                        ' --withHooks --withRedux --withPropTypes --withStyledComponents --isClass  --withCss');
                expect(result.toString().indexOf(`${componentName} was created successfully!`));
                verifyComponentIsCreated(componentName);
                expect(fs.existsSync(`./${componentName}/Styled${componentName}.js`)).toBeTruthy();
                expect(fs.existsSync(`./${componentName}/${componentName}.css`)).toBeTruthy();
            });
        });

        describe('when I create a class component with typescript and no additional options', () => {
            it('creates a bare class component with typescript', () => {
                const result =
                    execSync(`${PACKAGE_NAME} generate -i false --path ./ --name ${componentName} --isClass --ts`);
                expect(result.toString().indexOf(`${componentName} was created successfully!`));
                verifyComponentIsCreated(componentName);
            });
        });

        describe('when I create a class component with all options', () => {
            it('creates a class component with all options', () => {
                const result =
                    execSync(`${PACKAGE_NAME} generate -i false --path ./ --name ${componentName}` +
                        ' --withState --withRedux --withStyledComponents --isClass --ts');
                expect(result.toString().indexOf(`${componentName} was created successfully!`));
                verifyComponentIsCreated(componentName);
                expect(fs.existsSync(`./${componentName}/Styled${componentName}.js`)).toBeTruthy();
            });
        });
    });
});
