export default interface IGenerateAnswers {
    targetPath: string;
    componentName: string;
    withTypescript: boolean;
    isClassComponent: boolean;
    withPropTypes: boolean;
    withDefaultProps: boolean;
    withStyledComponents: boolean;
    withState?: boolean;
    withRedux?: boolean;
    withHooks?: boolean;
}
