import IJsxOptions from './IJsxOptions';
import {IStateProp} from './IStateProp';

export default interface ICodeGenerator {
    addImportStatement(input: string, from: string, names: string | string[], languageType: string): string;
    convertFunctionalComponentToClass(input: string, componentName: string, componentType: string): string;
    addJsx(input: string, jsx: string, options: IJsxOptions): string;
    addClassMethod(input: string, method: string): string;
    addExportStatement(input: string, exportData: string[]): string;
    addMapStateToProps(input: string, stateProps: IStateProp[]): string;
    addMapDispatchToProps(input: string, actionCreators: string[]): string;
}
