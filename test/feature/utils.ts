import {execSync} from 'child_process';

export function setupGit() {
    const email = 'd.andreev90@gmail.com';
    const user = 'D-Andreev';
    execSync(`git config --global user.email "${email}"`);
    execSync(`git config --global user.name "${user}"`);
}

export function buildPackage() {
    if (process.env.TEST_ENV === 'CI') {
        setupGit();
        execSync('sudo npm link');
        execSync('sudo npm install -g create-react-app');
    }
    execSync('yarn build');
}
