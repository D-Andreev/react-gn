import ITemplateService from './interfaces/ITemplateService';

export default class Template implements ITemplateService {
    private readonly templateEngine: typeof import('ejs');

    constructor(templateEngine: typeof import('ejs')) {
        this.templateEngine = templateEngine;
    }

    render(template: string, data: any, options: any = {}) {
        return this.templateEngine.render(template, data, options);
    }
}
