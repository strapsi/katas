import {expect} from 'chai';
import {describe} from 'mocha';
import {getPages} from '../src/pagination-control';

describe('pagination control tests', () => {
    it('should return an array', () => {
        expect(getPages(0, 0, 0)).is.empty;
    });

    it('should always return the first and last page', () => {
        const pages = getPages(5, 1, 2);
        expect(pages[0]).to.be.equal(1);
        expect(pages[pages.length - 1]).to.be.equal(5);
    });

    it('should return an empty array if its only 1 page', () => {
        expect(getPages(1, 0, 0))
            .to.be.empty;
    });

    it('should return 10 pages with 5 in the center', () => {
        expect(getPages(10, 5, 2))
            .deep.equal([1, 3, 4, 5, 6, 7, 10]);
    });

    it('should show more pages to the right if there is no space on the left side', () => {
        expect(getPages(10, 3, 3))
            .deep.equal([1, 2, 3, 4, 5, 6, 7, 8, 10]);
    });

    it('should show page 8 of 36', () => {
        expect(getPages(36, 8, 5))
            .deep.equal([1, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 36]);
    });

    it('cw failing #1', () => {
        expect(getPages(4, 1, 2))
            .deep.equal([1, 2, 3, 4]);
    });

    it('cw failing #2', () => {
        expect(getPages(13, 11, 3))
            .deep.equal([1, 6, 7, 8, 9, 10, 11, 12, 13]);

    });
});
