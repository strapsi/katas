import {describe} from 'mocha';
import {expect} from 'chai';
import {decoder} from '../src/reversing-obfuscator';

describe('bobs reversing obfuscator', () => {
    it('should decode simple message', () => {
        expect(decoder('Kan-nies ssad n', '-'))
            .to.equal('Kann dass sein');
    });

    it('should decode correctly with multiple markers in a string', () => {
        expect(decoder('q.qSusqsitanenev cen lsin sillom subinif ecsuF .itnetop essidnep', 'q'))
            .to.equal('Suspendisse potenti. Fusce finibus mollis nisl nec venenatis.');
    });

    it('cw successful #1', () => {
        expect(decoder('q.tile gnicsipida rutetcesnoc ,tema tis rolod muspi meroL', 'q'))
            .to.equal('Lorem ipsum dolor sit amet, consectetur adipiscing elit.');
    });

    it('cw failing #1', () => {
        expect(decoder('Dq.silucaiqonec mollq odommoc qis ipsum qlsin lev', 'q'))
            .to.equal('Donec mollis ipsum vel nisl commodo iaculis.');
    });
});
