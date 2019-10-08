const cp = require('child_process').execSync;

const a = cp('react-sdk init my-app --ejected --ts');
console.log(a.toString());
