import CodeGenerator from '../../../src/services/CodeGenerator';
import IJsxOptions from '../../../src/services/interfaces/IJsxOptions';
import {IStateProp} from '../../../src/services/interfaces/IStateProp';

describe('templates', () => {
    describe('importStatement', () => {
        describe('when names is one', () => {
            it('it returns a single import statement', () => {
                expect(CodeGenerator.getInstance()
                    .importStatement(['myFile'], './path/to/myFile.js', 'js')
                ).toEqual('import myFile from \'./path/to/myFile.js\';');
            });
        });
    });

    describe('convertFunctionalComponentToClass', () => {
        describe('when component type is Component', () => {
            it('returns the converted class', () => {
                const input = `
                    import React from 'react';
                    
                    function App() {
                        return (
                            <div>app</div>
                        );
                    }
                    
                    export default App;
                `;
                const componentName = 'App';
                const componentType = 'Component';

                const res = CodeGenerator.getInstance()
                    .convertFunctionalComponentToClass(input, componentName, componentType)
                    .replace(/\n\s+/g, '');
                expect(res).toContain('class App extends React.Component {');
                expect(res).toContain('render() {return (<div>app</div>);}');
            });
        });
    });

    describe('addJsx', () => {
        describe('when inside and after are not passed', () => {
            it('wraps everything', () => {
                const input = `
                    import React from 'react';
                    
                    function App() {
                        return (
                            <div>app</div>
                        );
                    }
                    
                    export default App;
                `;
                const jsx = `<Container foo="bar"></Container>`;
                const options: IJsxOptions = {};
                const res = CodeGenerator.getInstance().addJsx(input, jsx, options)
                    .replace(/\n\s+/g, '');
                expect(res).toContain('return (<Container foo=\"bar\"><div>app</div></Container>);');
            });
        });
        describe('when inside and after are passed', () => {
            it('it adds the new jsx in the correct place', () => {
                const input = `<div className="App">
                      <header className="App-header">
                        <img src={logo} className="App-logo" alt="logo" />
                        <h1 className="App-title">Welcome to React</h1>
                      </header>
                      <p className="App-intro">
                        To get started, edit <code>src/App.js</code> and save to reload
                      </p>
                    </div>
                );`;
                const jsx = `
                    <button onClick={this.simpleAction}>Test redux action</button>
                    <pre>
                        {JSON.stringify(this.props)}
                    </pre>`;
                const options: IJsxOptions = {
                    inside: '<div className="App"',
                    after: '<p className="App-intro"',
                    element: 'p',
                };
                const res = CodeGenerator.getInstance().addJsx(input, jsx, options)
                    .replace(/\n\s+/g, '');
                expect(res).toContain('<button onClick={this.simpleAction}>Test redux action</button>');
                expect(res).toContain('<pre>{JSON.stringify(this.props)}</pre>');
            });
        });
        describe('when only after is passed', () => {
            it('it adds the new jsx in the correct place', () => {
                const input = `<div className="App">
                      <header className="App-header">
                        <img src={logo} className="App-logo" alt="logo" />
                        <h1 className="App-title">Welcome to React</h1>
                      </header>
                      <p className="App-intro">
                        To get started, edit <code>src/App.js</code> and save to reload
                      </p>
                    </div>
                );`;
                const jsx = `
                    <button onClick={this.simpleAction}>Test redux action</button>
                    <pre>
                        {JSON.stringify(this.props)}
                    </pre>`;
                const options: IJsxOptions = {
                    after: '<p className="App-intro"',
                    element: 'p',
                };
                const res = CodeGenerator.getInstance().addJsx(input, jsx, options)
                    .replace(/\n\s+/g, '');
                expect(res).toContain('<React.Fragment>');
                expect(res).toContain('</React.Fragment>');
                expect(res).toContain('<pre>{JSON.stringify(this.props)}</pre>');
            });
        });
    });

    describe('addClassMethod', () => {
        it('adds the method', () => {
            const input = `
                    import React from 'react';
                    
                    class App extends React.Component {
                        render() {
                            return (
                                <div>app</div>
                            );
                        }
                    }
                    
                    export default App;
                `;
            const method = `simpleAction() {
                this.props.simpleAction();
            }`;
            const res = CodeGenerator.getInstance().addClassMethod(input, method, 'js')
                .replace(/\n\s+/g, '');
            expect(res).toContain('simpleAction() {this.props.simpleAction();}');
        });
    });

    describe('add export statement', () => {
        it('changes the export statement', () => {
            const input = `
                    import React from 'react';
                    
                    class App extends React.Component {
                        render() {
                            return (
                                <div>app</div>
                            );
                        }
                    }
                    
                    export default App;
                `;
            const exportData = ['mapStateToProps', 'mapDispatchToProps'];
            const res = CodeGenerator.getInstance().addExportStatement(input, exportData)
                .replace(/\n\s+/g, '');
            expect(res).toContain('export default connect(mapStateToProps, mapDispatchToProps)(App);');
        });
    });

    describe('add mapStateToProps', () => {
        describe('when no state props are passed', () => {
            it('adds the function with full state object mapped', () => {
                const input = `import React, { Component } from 'react';
                            import { connect } from 'react-redux';
                            import { simpleAction } from './actions/simpleAction';
                            import logo from './logo.svg';
                            import './App.css';
                            
                            class App extends Component {
                              simpleAction = (event) => {
                                this.props.simpleAction();
                              };
                            
                              render() {
                                return (
                                    <div className="App">
                                      <header className="App-header">
                                        <img src={logo} className="App-logo" alt="logo" />
                                        <h1 className="App-title">Welcome to React</h1>
                                      </header>
                                      <p className="App-intro">
                                        To get started, edit <code>src/App.js</code> and save to reload
                                      </p>
                                      <button onClick={this.simpleAction}>Test redux action</button>
                                      <pre>
                                         {JSON.stringify(this.props)}
                                      </pre>
                                    </div>
                                );
                              }
                            }
                            
                            export default connect(mapStateToProps, mapDispatchToProps)(App);
`;
                const stateProps: IStateProp[] = [];
                const res = CodeGenerator.getInstance().addMapStateToProps(input, stateProps)
                    .replace(/\n\s+/g, '');
                expect(res).toContain('const mapStateToProps = state => ({...state});');
            });
        });

        describe('when state props are passed', () => {
            it('adds the function with the props', () => {
                const input = `import React, { Component } from 'react';
                            import { connect } from 'react-redux';
                            import { simpleAction } from './actions/simpleAction';
                            import logo from './logo.svg';
                            import './App.css';
                            
                            class App extends Component {
                              simpleAction = (event) => {
                                this.props.simpleAction();
                              };
                            
                              render() {
                                return (
                                    <div className="App">
                                      <header className="App-header">
                                        <img src={logo} className="App-logo" alt="logo" />
                                        <h1 className="App-title">Welcome to React</h1>
                                      </header>
                                      <p className="App-intro">
                                        To get started, edit <code>src/App.js</code> and save to reload
                                      </p>
                                      <button onClick={this.simpleAction}>Test redux action</button>
                                      <pre>
                                         {JSON.stringify(this.props)}
                                      </pre>
                                    </div>
                                );
                              }
                            }
                            
                            export default connect(mapStateToProps, mapDispatchToProps)(App);
`;
                const stateProps: IStateProp[] = [
                    {name: 'user', path: ['user', 'userDetails']},
                    {name: 'data', path: ['data', 'someData']},
                ];
                const res = CodeGenerator.getInstance().addMapStateToProps(input, stateProps)
                    .replace(/\n\s+/g, '');
                const expectedOutput =
                    'const mapStateToProps = state => ({user: state.user.userDetails,\n' +
                    'data: state.data.someData,});';
                expect(res).toContain(expectedOutput);
            });
        });
    });

    describe('add mapDispatchToProps', () => {
        describe('when props are empty', () => {
            it('returns an empty mapDispatchToProps function', () => {
                const input = `
                    import React from 'react';
                    
                    class App extends React.Component {
                        render() {
                            return (
                                <div>app</div>
                            );
                        }
                    }
                    
                    export default App;
                `;

                const actionCreators: string[] = [];
                const res = CodeGenerator.getInstance().addMapDispatchToProps(input, actionCreators)
                    .replace(/\n\s+/g, '');
                expect(res).toContain('const mapDispatchToProps = dispatch => ({});');
            });
        });

        describe('when props are not empty', () => {
            it('returns an empty mapDispatchToProps function', () => {
                const input = `
                    import React from 'react';
                    
                    class App extends React.Component {
                        render() {
                            return (
                                <div>app</div>
                            );
                        }
                    }
                    
                    export default App;
                `;

                const actionCreators: string[] = ['simpleAction', 'someAction'];
                const res = CodeGenerator.getInstance().addMapDispatchToProps(input, actionCreators)
                    .replace(/\n\s+/g, '');
                const expectedRes =
                    'const mapDispatchToProps = ' +
                    'dispatch => ({' +
                    'simpleAction: () => dispatch(simpleAction()),' +
                    'someAction: () => dispatch(someAction()),);';
                expect(res).toContain(expectedRes);
            });
        });
    });
});
