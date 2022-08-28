import {expect} from 'chai';
import {describe} from 'mocha';
import {toArray, toRange} from '../src/ranges-of-numbers-in-array';

describe('ranges of numbers in array', () => {
    it('should a string from the toRange method', () => {
        expect(toRange([]))
            .to.be.empty;
    });

    it('should return a number array from the toArray method', () => {
        expect(toArray(''))
            .to.be.empty;
    });

    it('should return the correct numbers for the range 1_3,5', () => {
        expect(toArray('1_3,5'))
            .deep.equal([1, 2, 3, 5]);
    });

    it('should return an array from multiple ranges', () => {
        expect(toArray('1,5_9,10,12,14,21_36,99,101_110'))
            .deep.equal([1, 5, 6, 7, 8, 9, 10, 12, 14, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 99, 101, 102, 103, 104, 105, 106, 107, 108, 109, 110]);
    });

    it('should concat numbers 3-9', () => {
        expect(toRange([1, 3, 4, 5, 6, 7, 8, 9, 13]))
            .to.equal('1,3_9,13');
    });

    it('should concat multiple ranges', () => {
        expect(toRange([1, 27, 28, 29, 56, 26, 57, 99, 100, 101, 284, 33]))
            .to.equal('1,26_29,33,56_57,99_101,284');
    });

    it('should discard duplicates', () => {
        expect(toRange([1, 1, 2, 1, 3, 4, 5]))
            .to.equal('1_5');
    });
});
