import index from '../src/index';

describe('when I require the file', () => {
    it('works', () => {
        expect(index.count).toEqual(5);
    });
});
