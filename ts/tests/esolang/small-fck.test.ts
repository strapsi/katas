import {describe} from 'mocha';
import {expect} from 'chai';
import {interpreter} from '../../src/esolang/small-fck';


describe('small fck test', () => {
    it('should return a string', () => {
        expect(interpreter('', '')).not.to.be.undefined;
    });

    it('should flip the first bit', () => {
        expect(interpreter('*', '0000')).to.be.equal('1000');
    });

    it('should flip the first two bits', () => {
        expect(interpreter('*>*', '0000')).to.be.equal('1100');
    });

    it('cw: simple test #1', () => {
        expect(interpreter('*', '00101100')).to.be.equal('10101100');
    });

    it('cw: simple test #2', () => {
        expect(interpreter('>*>*', '00101100')).to.be.equal('01001100');
    });

    it('cw: simple test #3', () => {
        expect(interpreter('*>*>*>*>*>*>*>*', '00101100')).to.be.equal('11010011');
    });

    it('cw: simple test #4', () => {
        expect(interpreter('*>*>>*>>>*>*', '00101100')).to.be.equal('11111111');
    });

    it('cw: simple test #5', () => {
        expect(interpreter('>>>>>*<*<<*', '00101100')).to.be.equal('00000000');
    });

    it('cw: loop test #1', () => {
        expect(interpreter('*[>*]', '0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000'))
            .to.be.equal('1111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111');
    });
});