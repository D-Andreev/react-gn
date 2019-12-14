export default interface ITemplate {
    render(template: string, data: any, options?: any): string;
}
