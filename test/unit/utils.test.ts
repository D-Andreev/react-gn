import {isAffirmativeAnswer} from '../../src/utils';

describe('utils', () => {
    describe('isAffirmativeAnswer', () => {
        describe('when answer is affirmative by default', () => {
            describe('when answer is negative', () => {
                it('returns false', () => {
                    expect(isAffirmativeAnswer('no', true)).toBeFalsy();
                });
            });

            describe('when answer is affirmative', () => {
                it('returns true', () => {
                    expect(isAffirmativeAnswer('y', true)).toBeTruthy();
                });
            });

            describe('when answer is blank', () => {
                it('returns true', () => {
                    expect(isAffirmativeAnswer('y', true)).toBeTruthy();
                });
            });
        });

        describe('when answer is negative by default', () => {
            describe('when answer is negative', () => {
                it('returns false', () => {
                    expect(isAffirmativeAnswer('no')).toBeFalsy();
                });
            });

            describe('when answer is affirmative', () => {
                it('returns true', () => {
                    expect(isAffirmativeAnswer('y')).toBeTruthy();
                });
            });

            describe('when answer is blank', () => {
                it('returns true', () => {
                    expect(isAffirmativeAnswer('')).toBeFalsy();
                });
            });
        });
    });
});
