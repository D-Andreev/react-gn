import { execSync } from 'child_process';
import fs from 'fs';
import {
    PACKAGE_NAME
} from '../../src/constants';
import {buildPackage} from './utils';

function verifyComponentIsCreated(componentName: string, extension = 'jsx') {
    expect(fs.existsSync(`./${componentName}/${componentName}.${extension}`)).toBeTruthy();
    execSync('npm run build');
}

describe('generate-command', () => {
    let componentName: string;
    beforeAll(() => {
        componentName = 'MyCounter';
        buildPackage();
    });

    afterEach(() => {
        // execSync(`rm -rf ./${componentName}`);
    });

    describe('when I do not use a template', () => {
        describe('when I use all the default options', () => {
            test.only('creates a javascript functional component in the same directory', () => {
                const result =
                    execSync(`${PACKAGE_NAME} generate -i false --path ./ --name ${componentName}`);
                expect(result.toString().indexOf(`${componentName} was created successfully!`));
                verifyComponentIsCreated(componentName);
            });
        });
    });
});
