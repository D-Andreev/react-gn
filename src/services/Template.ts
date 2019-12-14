import ITemplate from './interfaces/ITemplate';

export default class Template implements ITemplate {
    private readonly templateEngine: typeof import('ejs');

    constructor(templateEngine: typeof import('ejs')) {
        this.templateEngine = templateEngine;
    }

    render(template: string, data: any, options: any = {}) {
        return this.templateEngine.render(template, data, options);
    }
}
