import {getEditDistance, minOfThreeNumbers} from '../../src/utils';

describe('utils', () => {
    describe('minOfThreeNumbers', () => {
        it('returns the min of the three numbers', () => {
            expect(minOfThreeNumbers(5, 2, 10)).toEqual(2);
        });
    });

    describe('getEditDistance', () => {
        describe('when first string is empty', () => {
            it('returns the length of the second string', () => {
                expect(getEditDistance('', 'testing', 0, 7));
            });
        });

        describe('when second string is empty', () => {
            it('returns the length of the first string', () => {
                expect(getEditDistance('testing', '', 7, 0));
            });
        });

        describe('when the two strings are not empty', () => {
            it('returns the correct edit distance', () => {
                const str1 = 'sunday';
                const str2 = 'saturday';
                expect(getEditDistance(str1, str2, str1.length, str2.length)).toEqual(3);
            });
        });
    });
});