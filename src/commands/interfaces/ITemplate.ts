export interface IDependency {
    name: string;
    version: string;
}

export interface IFile {
    extension: string;
    contents: string;
    removeOriginal?: string;
}

export default interface ITemplate {
    [key: string]: {
        js: IDependency[] | IFile[];
        ts: IDependency[] | IFile[];
    };
}

