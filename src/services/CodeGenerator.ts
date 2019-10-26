import ICodeGenerator from './interfaces/ICodeGenerator';
import IJsxOptions from './interfaces/IJsxOptions';
import {RETURN_STATEMENT_MIN_MATCH_COUNT} from '../constants';
import {IStateProp} from './interfaces/IStateProp';

export default class CodeGenerator implements ICodeGenerator {
    private static instance: ICodeGenerator;
    private templates: any;
    private readonly returnStatementRegex: RegExp;

    private constructor() {
        this.templates = {
            importStatement: {
                js: {
                    single: (name: string, from: string): string => {
                        return `import ${name} from '${from}';`
                    },
                    multiple: (names: string[], from: string): string => {
                        let imports: string = names.join(', ');
                        return `import {${imports}} from ${from}`
                    }
                }
            },
        };
        this.returnStatementRegex = /(return )\(([\s\S]*)\);/;
    }

    static getInstance() {
            if (!CodeGenerator.instance) {
                CodeGenerator.instance = new CodeGenerator();
            }
            return CodeGenerator.instance;
    }

    private matchReturnStatement(input: string): string | null {
        const mathReturnStatement: RegExpMatchArray | null = input.match(this.returnStatementRegex);
        if (!mathReturnStatement || mathReturnStatement.length < RETURN_STATEMENT_MIN_MATCH_COUNT) {
            return null;
        }

        return mathReturnStatement[2];
    }

    private jsxPutAfter(input: string, jsx: string, options: IJsxOptions): string {
        input = input.replace(options.after, 'P1');
        input = input.replace(`</${options.element}>`, 'P2');
        const match = input.match(/(P1>)[\s]+.*[\s]+P2/);

        input = input.replace('P1', options.after);
        input = input.replace('P2',
            `</${options.element}>\n${jsx}`);

        return input;
    }

    private matchExport(input: string): RegExpMatchArray | undefined {
        const matchExport: RegExpMatchArray = input.match(/export default (.*);/);
        if (!matchExport || matchExport.length < 2) {
            return;
        }

        return matchExport;
    }

    private matchExportDefault(input: string): RegExpMatchArray | undefined {
        const matchExport: RegExpMatchArray = input.match(/(export default) (.*);/);
        if (!matchExport || matchExport.length < 3) {
            return;
        }

        return matchExport;
    }

    importStatement(names: string[], from: string, languageType: string): string {
        if (names.length === 1) {
            return this.templates.importStatement[languageType].single(names[0], from);
        }

        return this.templates.importStatement[languageType].multiple(names, from);
    }

    // TODO: Add extends<Props>... (Add language type and param for props)
    convertFunctionalComponentToClass(input: string, componentName: string, componentType: string): string {
        input = input.replace(
            `function ${componentName}()`,
            `class ${componentName} extends React.${componentType}`,
        );

        const mathReturnStatement: string | null = this.matchReturnStatement(input);
        if (mathReturnStatement === null) {
            return input;
        }

        return input.replace(this.returnStatementRegex, `
                render() {
                    return (
                        ${mathReturnStatement}
                    );
                }
            `);
    }

    addJsx(input: string, jsx: string, options: IJsxOptions): string {
        if (!options.hasOwnProperty('inside') && !options.hasOwnProperty('after')) {
            const mathReturnStatement: string | null = this.matchReturnStatement(input);
            if (mathReturnStatement === null) {
                return input;
            }

            const wrapped = jsx.replace('></', `>
                ${mathReturnStatement}
            </`);
            return input.replace(mathReturnStatement, wrapped);

        }

        if (options.inside) {
            if (!options.after) {
                return input.replace(`${options.inside}`, `${options.inside}
                    ${jsx}`);
            }

            return this.jsxPutAfter(input, jsx, options);
        } else {
            if (options.after) {
                return `<React.Fragment>
                    ${this.jsxPutAfter(input, jsx, options).replace(');', '')}
                </React.Fragment>`;
            }
            return input;
        }
    }

    addClassMethod(input: string, method: string, languageType: string): string {
        const matchStartOfClass: RegExpMatchArray = input.match(/extends React.Component {[\s]+/);
        if (!matchStartOfClass || matchStartOfClass.length < 1) {
            return input;
        }

        return input.replace(matchStartOfClass[0], `${matchStartOfClass[0]}\n${method}`);
    }

    addExportStatement(input: string, exportData: string[]): string {
        const matchClassName: RegExpMatchArray = input.match(/class (.*) extends/);
        if (!matchClassName || matchClassName.length < 2) {
            return input;
        }
        const exportMatch: RegExpMatchArray | undefined = this.matchExport(input);
        if (!exportMatch) {
            return input;
        }
        return input.replace(
            exportMatch[0],
            `export default connect(${exportData.join(', ')})(${matchClassName[1]});`
        );
    }

    addMapStateToProps(input: string, stateProps: IStateProp[]): string {
        const matchExport: RegExpMatchArray = this.matchExportDefault(input);
        if (!matchExport) {
            return;
        }

        if (!stateProps.length) {
            return input.replace(matchExport[1], `const mapStateToProps = state => ({
            ...state
        });\n${matchExport[1]}`)
        }
        const objLiteral = stateProps
            .map((s: IStateProp) => `${s.name}: state.${s.path.join('.')},`)
            .join('\n');

        return input.replace(matchExport[1], `const mapStateToProps = state => ({
            ${objLiteral}
        });\n${matchExport[1]}`);
    }

    addMapDispatchToProps(input: string, actionCreators: string[]): string {
        const matchExport: RegExpMatchArray = this.matchExportDefault(input);
        if (!matchExport) {
            return;
        }

        if (!actionCreators.length) {
            return input.replace(
                matchExport[1],
                `const mapDispatchToProps = dispatch => ({});\\n${matchExport[1]}`
            );
        }

        const objectLiteral = actionCreators
            .map((a: string) => `${a}: () => dispatch(${a}()),`)
            .join('');

        return input.replace(
            matchExport[1],
            `const mapDispatchToProps = dispatch => ({${objectLiteral});\\n${matchExport[1]}`
        );
    }
}
