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

describe('template command', () => {
    let componentName: string;
    beforeAll(() => {
        componentName = 'MyCounter';
        buildPackage();
    });

    afterEach(() => {
        execSync(`rm -rf ./${componentName}`);
    });

    it('creates all the files based on given template', () => {
        const result =
            execSync(`${PACKAGE_NAME} template -i false --path ./ --name ${componentName}` +
                ' --template ./test/feature/templates/component');
        expect(result.toString()).toContain(`${componentName} was created successfully!`);
        verifyComponentIsCreated(componentName);
    });
});
