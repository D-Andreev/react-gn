// This script copies non-typescript files to the dist directory after build.
// Because they are not typescript files `tsc` does not include them when building.
const ncp = require('ncp').ncp;
const path = require('path');

const destination = path.join('dist', 'commands', 'generate', 'templates');
let source = path.join('src', 'commands', 'generate', 'templates');

function copyFiles(source, destination, done) {
  ncp(source, destination, function (err) {
    if (err) {
      console.error(err);
      process.exit(1);
    }
    done();
  });
}

copyFiles(path.join(source, 'js'), path.join(destination, 'js'), () => {
  copyFiles(path.join(source, 'ts'), path.join(destination, 'ts'), () => {
    copyFiles(path.join(source, 'data'), path.join(destination, 'data'), () => {
      console.log('Build is successful!');
    });
  })
});