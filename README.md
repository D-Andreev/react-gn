
# react-gn [![CircleCI](https://circleci.com/gh/NdagiStanley/python_app.svg?style=svg)](https://circleci.com/gh/D-Andreev/react-gn) [![PRs Welcome](https://img.shields.io/badge/PRs-welcome-green.svg)](https://github.com/D-Andreev/react-gn/blob/master/CONTRIBUTING.md)  
  
Create and develop react apps and components using a CLI.  
  
- [Installation](#install)  
- [Creating an App with `new` command](#new)  
- [Creating new components with `generate` command](#generate)  
- [Creating new components with `tempalate` command](#template)  
  
<a name="install"></a>  
## Installation  
  
`react-gn` can be installed globally:  
<div class="language-sh">  
    npm i @react-gn/react-gn -g  
</div>  
Or with yarn:  
<div class="language-sh">  
    yarn global add @react-gn/react-gn  
</div>  
  
## Dependencies  
The main dependency of `react-gn` is [create-react-app](https://create-react-app.dev/), which [requires Node >= 8.10](https://create-react-app.dev/docs/getting-started#creating-an-app). You can use [nvm](https://github.com/creationix/nvm#installation) (macOS/Linux) or [nvm-windows](https://github.com/coreybutler/nvm-windows#node-version-manager-nvm-for-windows) to switch Node versions between different projects.  
  
<a name="new"></a>  
## new  
  
Creates a new react application.  
  
react-gn **new** *\<name\>* [*options*]  
react-gn **n** *\<name\>* [*options*]  

  ![Farmers Market Finder Demo](https://i.imgur.com/UCGN1mA.gif)<br>  
  
### Description  
`react-gn` uses [create-react-app](https://create-react-app.dev/) under the hood to create a react application. You can see the current file structure of a new create-react-app [here](https://create-react-app.dev/docs/getting-started#output).  
  
### Arguments  
| Argument      | Description                            |  
| ------------- | -------------                          |  
| *\<name\>* | A name for the new react application.  |  
  
### Options  
| Option               |  Alias | Description                                    | Default |  
| --------------       | ------ | -----------------------------------------      | ------- |  
| *- -interactive* | *-i* |  When `false`, disables interactive mode.      	     | `true`  |  
| *- -ts* | -          |  When passed, adds setup for typescript in the new app. | `false` |  
| *- -withRedux* | -wr |  When passed, adds setup for redux and redux thunk.     | `false` |  
| *- -ejected* | -e    |  When passed, ejects the create-react-app.              | `false` |  
  
### Demo  
You can checkout the result from running the `new` command with `typescript` and `redux` options applied in the [demos](https://github.com/D-Andreev/react-gn/tree/master/demos/new-command-example).  
  
<a name="creating-components"></a>  
## generate  
  
Generates a new component.  
  
react-gn **generate** [*options*]  
react-gn **g** [*options*]  
  
![react-gn-generate](https://i.imgur.com/IUN1a81.gif)<br>  
  
### Description  
Generates new components and applies different options (i.e. class or functional component, styling options, typescript, redux etc...).  
  
### Options  
| Option                    |  Alias | Description                                                   | Default        |  
| --------------            | ------ | -----------------------------------------                     | -------        |  
| *- -interactive* | *-i* |  When `false`, disables interactive mode.                     | `true`         |  
| *- -ts* | -      |  When passed, the component is created with typescript.              | `false`        |  
| *- -path* | -p     |  A target path for the new component.                         | `./`           |  
| *- -dirName* | -      |  A name for the new component directory.                      | `my-component` |  
| *- -isClass* | -class |  Create a class component                                     | `false`   |  
| *- -withHooks* | -wh    |  Specify whether to use hooks or not.                         | `false`        |  
| *- -withState* | -ws    |  Specify whether to use state or not.                         | `false`        |  
| *- -withPropTypes* | -wpt   |  Specify whether to use prop types or not.                    | `false`        |  
| *- -withCss* | -wcss  |  Specify whether to use css for styling or not.               | `true`         |  
| *- -withLess* | -wless |  Specify whether to use LESS for styling or not.              | `false`        |  
| *- -withSass* | -wsass |  Specify whether to use SASS for styling or not.              | `false`        |  
| *- -withStyledComponents* | -wsc   |  Specify whether to use Styled Components for styling or not. | `false`        |  
  ### Demo  
You can checkout the result from running the `generate` command with some options applied in the [demos](https://github.com/D-Andreev/react-gn/tree/master/demos/generate-command-example).  
   
<a name="template"></a>  
## template  
  
Generates a new component based on a template.  
  
react-gn **template** [*options*]  
react-gn **t** [*options*]  
  
![react-gn-template](https://i.imgur.com/bDBNYa5.gif)<br>  
  
### Description  
Creation of new components can be customized using ejs templates. Create templates for the different component types you would need to create and use them when needed.  
  
### Options  
| Option               |  Alias | Description                                    | Default        |  
| --------------       | ------ | -----------------------------------------      | -------        |  
| *- -interactive* | *-i* |  When `false`, disables interactive mode.      | `true`         |  
| *- -template* | -t     |  Template directory name.                      | `./`           |  
| *- -path* | -p     |  A target path for the new component.          | `./`           |  
| *- -dirName* | -      |  A name for the new component directory.       | `my-component` |  
  
### Demo  
Let's create a template for a container component.  You can create a `./templates` directory in your project and put the different templates there. 
`./templates/container/{Component}.jsx.ejs`  
```jsx  
import React, { Component } from "react";  
import { connect } from "react-redux";  
import "./<%= Component %>.css";  
import * as PropTypes from "prop-types";  
  
class <%= Component %> extends Component {  
 constructor(props) {
  super(props); this.state = <%= state %>;
 }
 render() {
  return ( <div><%= Component %></div> ); 
 }
}  
  
const mapDispatchToProps = dispatch => ({});  
  
const mapStateToProps = state => ({});  
  
<%= Component %>.propTypes = {  
 className: PropTypes.string
};  
  
export default connect(mapStateToProps, mapDispatchToProps)(<%= Component %>);  
```  
`./templates/container/{Component}.test.jsx`  
```jsx  
import React from 'react';  
import ReactDOM from 'react-dom';  
import <%= Component %> from './<%= Component %>';  
  
it('renders without crashing', () => {  
 const div = document.createElement('div');
 ReactDOM.render(<<%= Component %> />, div);
 ReactDOM.unmountComponentAtNode(div);
});  
```  
  
`./templates/container/{Component}.styles.css.ejs`  
```css  
.<%= Component %> {  
 color: red;
}  
```  
Additionally you can create a `data.json` file which will contain data that will be used when rendering the templates. If this file is not provided the only data being passed to the templates will be the component name. In some cases if additional data is required you can create a data file:  
`./templates/container/data.json`  
```javascript  
{
  "state": {"count": 0}
}
```  
By using the `template` command the templates will be rendered, inserting the component name and all additional data passed from `data.json`.  
You can checkout the result of running the `template` command in the in the [demos](https://github.com/D-Andreev/react-gn/tree/master/demos/template-command-example).  
  
  
## Acknowledgements  
`react-gn` would not be possible without the help from these existing projects:  
* [create-react-app](https://github.com/facebook/create-react-app/)  
* [inquirer](https://github.com/SBoudrias/Inquirer.js/)  
* [ejs](https://github.com/mde/ejs)  
  
## Contributing  
If something doesnt’t work, please [file an issue](https://github.com/D-Andreev/react-gn/issues/new).<br>  
If you have any ideas for features or improvements, PRs are welcome.  
  
## License  
`react-gn` is open source software [licensed as MIT](https://github.com/D-Andreev/react-gn/blob/master/LICENSE).
