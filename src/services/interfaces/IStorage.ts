export default interface IStorage {
    create(): void;
    read(): void;
    update(): void;
    delete(): void;
}
