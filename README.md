# react-gn [![CircleCI](https://circleci.com/gh/NdagiStanley/python_app.svg?style=svg)](https://circleci.com/gh/D-Andreev/react-gn) [![PRs Welcome](https://img.shields.io/badge/PRs-welcome-green.svg)](https://github.com/D-Andreev/react-gn/blob/master/CONTRIBUTING.md)

Create and develop react apps and components using a CLI.

- [Installation](#install)
- [Creating an App](#creating-an-app)
- [Creating new components](#creating-components)
- [Creating new components with templates](#creating-components-templates)

If something doesnt’t work, please [file an issue](https://github.com/D-Andreev/react-gn/issues/new).<br>

<a name="install"></a>
## Installation
```shell script
npm install @react-gn/react-gn
```
or
```shell script
yarn add @react-gn/react-gn
```

<a name="creating-an-app"></a>
## Creating an app
![Farmers Market Finder Demo](https://i.imgur.com/UCGN1mA.gif)<br>
To create an app run the `new` command and specify the name of your new project. Then several prompts will appear asking you for the different options you want to use i.e Will you be using `typescript`, `redux` etc...
```shell script
react-gn new my-app
```
or with alias
```shell script
react-gn n my-app
```
`react-gn` uses `create-react-app` under the hood to bootstrap the application. For further details please read the full [documentation](https://github.com/D-Andreev/react-gn).

<a name="creating-components"></a>
## Creating new components
![react-gn-generate](https://i.imgur.com/IUN1a81.gif)<br>
```shell script
react-gn generate
```
or with alias
```shell script
react-gn g
```
Then several prompts will appear asking you for the different options you may want to use for your new component:
 * Target directory for the component
 * Component directory name
 * Will you be using typescript
 * Is it a class or functional component
 * What will you use for styling of the new component i.e css, sass, less, styled components etc...
 
 For further details please read the full [documentation](https://github.com/D-Andreev/react-gn).
 
 <a name="creating-components-templates"></a>
 ## Creating new components with templates
![react-gn-template](https://i.imgur.com/bDBNYa5.gif)<br>
Because every react application is different, `react-gn` exposes a command for creating new components with custom templates.
You can create template files using `ejs` and use them to generate new components.
 ```shell script
react-gn template
```
or with alias
```shell script
react-gn t
```
Then several prompts will appear asking you for the path to your template, target directory for your new component etc...
For further details on how to create templates and use them please read the full [documentation](https://github.com/D-Andreev/react-gn).

## Acknowledgements
`react-gn` would not be possible without the help from these existing projects:
* [create-react-app](https://github.com/facebook/create-react-app/)
* [inquirer](https://github.com/SBoudrias/Inquirer.js/)
* [ejs](https://github.com/mde/ejs)

## License
`react-gn` is open source software [licensed as MIT](https://github.com/D-Andreev/react-gn/blob/master/LICENSE).
