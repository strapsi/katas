const assemblerInterpreter = require('../assemblerII');

describe('assembler II tests', () => {
    it('should return -1 without end statement', () => {
        expect(assemblerInterpreter('')).toBe(-1);
    });

    it('should return the value of the MSG register on END', () => {
        expect(assemblerInterpreter('end')).toBeUndefined()
    });

    it('should save an integer in register x and from there into msg', () => {
        expect(assemblerInterpreter(`
        mov x, 13
        msg x
        end`)).toBe('13');
    });

    it('should compose the msg of a string and the value in register x', () => {
        expect(assemblerInterpreter(`mov x, 42
        msg 'answer = ', x
        end`)).toBe("answer = 42")
    });

    it('should compose a MSG with multiple register values and string values', () => {
        expect(assemblerInterpreter(`mov x, 13
        mov y, 42
        msg y, ' - ', x, ' = ', 'at least 40 :)'
        end`)).toBe('42 - 13 = at least 40 :)')
    });

    xit('should interpret strings with commas correctly', () => {
        expect(assemblerInterpreter(`mov x, 13
        mov y, 42
        msg 'x, y = (', x, ', ', y, ')'
        end`)).toBe('x, y = (13, 42)')
    });

    it('should increase the value in register x', () => {
        expect(assemblerInterpreter(`mov x, 12
        inc x
        msg x
        end`)).toBe('13')
    });

    it('should decrease the value in register x', () => {
        expect(assemblerInterpreter(`mov x, 14
        dec x
        msg x
        end`)).toBe('13')
    });

    it('should add the value of register y to the value in register x', () => {
        expect(assemblerInterpreter(`mov x, 6
        mov y, 7
        add x, y
        msg x
        end`)).toBe('13')
    });

    it('should subtract the value of register x by the value of register x', () => {
        expect(assemblerInterpreter(`mov x, 20
        mov y, 7
        sub x, y
        msg x
        end`)).toBe('13')
    });

    it('should multiply the value of register x with the value of register y', () => {
        expect(assemblerInterpreter(`mov x, 6
        mov y, 2
        mul x, y
        msg x
        end`)).toBe('12')
    });

    it('should divide the value of register x by the value of register y', () => {
        expect(assemblerInterpreter(`mov x, 26
        mov y, 2
        div x, y
        msg x
        end`)).toBe('13')
    });

    it('should return an integer as division result', () => {
        expect(assemblerInterpreter(`mov x, 25
        mov y, 3
        div x, y
        msg x
        end`)).toBe('8')
    });
    
    it('should call a function to add 10 to the value in register x', () => {
        expect(assemblerInterpreter(`mov x, 3
        call add_ten
        msg x
        end        
        add_ten:
            add x, 10
            ret        
        `)).toBe('13')
    });

    it('should CMP x and y and jump to add_ten if x and y are not equal', () => {
        expect(assemblerInterpreter(`mov x, 3
        mov y, 13
        cmp x, y
        jne add_ten
        msg x
        end
        add_ten:
            add x, 10
            ret
        `)).toBe('13')
    });
});