export default interface IWizard {
    askNewCommandQuestions(done: Function): void;
    askGenerateCommandQuestions(done: Function): void;
}