export default interface IGenerateAnswers {
    targetPath: string;
    componentName: string;
    languageType: string;
    isClassComponent: boolean;
    withPropTypes: boolean;
    withStyledComponents: boolean;
    withState: boolean;
    withRedux: boolean;
    withHooks: boolean;
}
