import { execSync } from 'child_process';
import * as fs from 'fs';
import {
    PACKAGE_NAME
} from '../../src/constants';
import {buildPackage} from './utils';

function verifyComponentIsCreated(componentName: string, componentDirName: string, isJs = true) {
    expect(fs.existsSync(`./${componentName}/${componentDirName}.${isJs ? 'jsx' : 'tsx'}`)).toBeTruthy();
    expect(fs.existsSync(`./${componentName}/${componentDirName}.test.${isJs ? 'js' : 'ts'}`)).toBeTruthy();
}

describe('template command', () => {
    let componentName: string;
    let componentDirName: string;

    beforeAll(() => {
        componentName = 'MyCounter';
        componentDirName = 'my-counter';
        buildPackage();
    });

    afterEach(() => {
        execSync(`rm -rf ./${componentName}`);
    });

    it('creates all the files based on given template', () => {
        const result =
            execSync(`${PACKAGE_NAME} template -i false --path ./ --dirName ${componentName}` +
                ' --template ./test/feature/templates/component');
        expect(result.toString()).toContain(`${componentName} was created successfully!`);
        verifyComponentIsCreated(componentName, componentDirName);
    });
});
