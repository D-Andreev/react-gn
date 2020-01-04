export default interface IGenerateAnswers {
    targetPath: string;
    componentName: string;
    componentDirName: string;
    languageType: string;
    isClassComponent: boolean;
    withPropTypes: boolean;
    withCss: boolean;
    withSass: boolean;
    withLess: boolean;
    withStyledComponents: boolean;
    withState: boolean;
    withRedux: boolean;
    withHooks: boolean;
}
