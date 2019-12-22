import Template from '../../../src/services/Template';
import ejs from 'ejs';
import ITemplateService from '../../../src/services/interfaces/ITemplateService';

describe('Template', () => {
    let templateService: ITemplateService;
    let renderMock: any;

    beforeEach(() => {
        templateService = new Template(ejs);
        renderMock = ejs.render;
    });

    describe('render', () => {
        describe('when template engine yields error', () => {
            it('yields error', () => {
                ejs.render = jest.fn(() => {
                    throw new Error('Error rendering template');
                });
                expect(() => {
                    templateService.render('', {});
                }).toThrow(new Error('Error rendering template'));
            });
        });

        it('renders the template', () => {
            // @ts-ignore
            ejs.render = jest.fn(() => {
                return 'rendered template';
            });
            expect(templateService.render('', '')).toEqual('rendered template');
        });
    });
});
