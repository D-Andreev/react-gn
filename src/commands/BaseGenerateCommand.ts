import Output from '../lib/Output';
import {ASCII_ART, COMMAND_FLAG, OUTPUT_TYPE, PRETTIFIABLE_EXTENSIONS} from '../constants';
import {noop} from '../utils';
import IUserInterface from '../services/interfaces/IUserInterface';
import Flag from '../lib/Flag';
import IRenderedTemplate from './interfaces/IRenderedTemplate';
import steed from 'steed';
import IPrettier from '../services/interfaces/IPrettier';
import IStorage from '../services/interfaces/IStorage';
import {sep} from 'path';
import * as path from 'path';

export default class BaseGenerateCommand {
    public renderedTemplates: IRenderedTemplate[];

    constructor(public userInterface: IUserInterface,
                public prettier: IPrettier,
                public storage: IStorage,
                public flags: Flag[]) {
    }

    protected extractFileNameFromPath(filePath: string): string {
        const splitPath: string[] = path.resolve(filePath).split(sep);
        return splitPath[splitPath.length - 1];
    }

    protected onError(err: Error, done: Function): void {
        const output: Output[] = [new Output(err.message, OUTPUT_TYPE.ERROR)];
        this.userInterface.showOutput(output, noop);
        return done(err);
    }

    protected isInteractiveModeDisabled(): boolean {
        return !!this.flags.find((f: Flag) => f.name === COMMAND_FLAG.INTERACTIVE && f.value === 'false');
    }

    protected getFlagValue(flagName: string): string {
        const flag: Flag | undefined = this.flags.find((f: Flag) => f.name === flagName);
        if (!flag) {
            return '';
        }

        return flag.value;
    }

    protected prettifyCode(done: Function): void {
        const filesThatCanBePrettified: IRenderedTemplate[] = this.renderedTemplates
            .filter((renderedTemplate: IRenderedTemplate) => {
                let isPrettifiable = false;

                for (let i = 0; i < PRETTIFIABLE_EXTENSIONS.length; i++) {
                    const currentExtension = PRETTIFIABLE_EXTENSIONS[i];
                    const lastChars: string = renderedTemplate
                        .path
                        .substr(renderedTemplate.path.length - currentExtension.length);
                    if (lastChars === currentExtension) {
                        isPrettifiable = true;
                        break;
                    }
                }

                return isPrettifiable;
            });

        steed.mapSeries(filesThatCanBePrettified, (template: IRenderedTemplate, next: Function) => {
            this.prettier.prettify(template.content, (err: Error, formattedCode: string) => {
                if (err) {
                    return next(err);
                }

                const index: number = this.renderedTemplates.findIndex(f => f.path === template.path);
                if (index === -1) {
                    return next(`Could not format ${template.path}`);
                }

                this.renderedTemplates[index].content = formattedCode;
                next();
            });
        }, (err: Error) => done(err));
    }

    protected showLogo() {
        const output: Output[] = [new Output(ASCII_ART.LOGO, OUTPUT_TYPE.SUCCESS)];
        this.userInterface.showOutput(output, noop);
    }

    protected showResults(componentName: string): void {
        const message = `${componentName} was created successfully!`;
        const output: Output[] = [new Output(message, OUTPUT_TYPE.SUCCESS)];
        this.userInterface.showOutput(output, noop);
        this.renderedTemplates.forEach((renderedTemplate: IRenderedTemplate) => {
            const message = `  - ${renderedTemplate.path}`;
            const output: Output[] = [new Output(message, OUTPUT_TYPE.SUCCESS)];
            this.userInterface.showOutput(output, noop);
        });
    }
}
