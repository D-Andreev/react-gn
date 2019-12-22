export default interface ITemplateService {
    render(template: string, data: any, options?: any): string;
}
