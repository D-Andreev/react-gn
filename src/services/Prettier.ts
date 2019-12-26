import IPrettier from './interfaces/IPrettier';

const DEFAULT_FORMAT_OPTIONS: any = {
    semi: true,
    singleQuote: true,
    parser: 'babel',
};

class Prettier implements IPrettier {
    private readonly prettier: typeof import('prettier');

    constructor(prettier: typeof import('prettier')) {
        this.prettier = prettier;
    }

    public prettify(code: string, done: Function): void {
        try {
            const formattedCode: string = this.prettier.format(code, DEFAULT_FORMAT_OPTIONS);
            done(null, formattedCode);
        } catch (e) {
            done(e);
        }
    }
}

export default Prettier;