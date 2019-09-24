import IStorage from '../../src/services/interfaces/IStorage';

export default class MockStorage implements IStorage {
    create(): void {
    }

    delete(): void {
    }

    read(): void {
    }

    update(): void {
    }

    directoryExists(path: string, done: Function): void {
    }
}
