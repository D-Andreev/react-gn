export interface IDependency {
    name: string;
    version?: string;
    isDev?: boolean;
}

export interface IFile {
    extension: string;
    contents: string;
    removeFiles?: string[];
}

export default interface ITemplate {
    [key: string]: {
        js: IDependency[] | IFile[];
        ts: IDependency[] | IFile[];
    };
}

