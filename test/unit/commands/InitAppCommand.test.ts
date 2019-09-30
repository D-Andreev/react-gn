import InitAppCommand from '../../../src/commands/init-app/InitAppCommand';

class MockInitAppCommand extends InitAppCommand {
    constructor(...args: undefined[]) {
        // @ts-ignore
        super(...args);
    }
}

describe('InitAppCommand', () => {
    let mockInitAppCommand;
    beforeEach(() => {
        mockInitAppCommand = new MockInitAppCommand();
    });

    describe('execute', () => {

    });
});
