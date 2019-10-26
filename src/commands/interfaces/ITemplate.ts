interface IDependency {
    name: string;
    version: string;
}

interface IFile {
    extension: string;
    contents: string;
}

export default interface ITemplate {
    [key: string]: {
        js: IDependency[] | IFile[];
        ts: IDependency[] | IFile[];
    };
}

