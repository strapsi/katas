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
        end`)).toBe('answer = 42')
    });

    it('should compose a MSG with multiple register values and string values', () => {
        expect(assemblerInterpreter(`mov x, 13
        mov y, 42
        msg y, ' - ', x, ' = ', 'at least 40 :)'
        end`)).toBe('42 - 13 = at least 40 :)')
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
        output:
            msg x
            end
        add_ten:
            add x, 10
            jmp output
        `)).toBe('13')
    });

    it('should interpret this more complex code', () => {
        expect(assemblerInterpreter(`
        mov a, 13 ; age
        mov e, 18 ; adult
        call check_age
        end
                
        check_age:
            cmp a, e
            jge entrance_allowed
            jmp entrance_denied
            
        entrance_allowed:
            msg 'you\'re welcome with ', a, ' years of age'
            ret
        
        entrance_denied:
            msg 'you are too young. only ', a, ' years'
            ret
        `)).toBe('you are too young. only 13 years')
    });

    // feature
    it('should interpret strings with commas and semicolons correctly', () => {
        expect(assemblerInterpreter(`mov x, 13
        mov y, 42 ; ignore me
        msg 'x, y = (', x, '; ', y, ')'
        end`)).toBe('x, y = (13; 42)')
    });

    it('cw: my first program', () => {
        expect(assemblerInterpreter(`; My first program
        mov  a, 5
        inc  a
        call function
        msg  '(5+1)/2 = ', a    ; output message
        end
        
        function:
            div  a, 2
            ret`)).toBe('(5+1)/2 = 3')
    });

    it('cw: factorial', () => {
        expect(assemblerInterpreter(`mov   a, 5
        mov   b, a
        mov   c, a
        call  proc_fact
        call  print
        end
        
        proc_fact:
            dec   b
            mul   c, b
            cmp   b, 1
            jne   proc_fact
            ret
        
        print:
            msg   a, '! = ', c ; output text
        ret`)).toBe('5! = 120')
    });

    it('cw: mod', () => {
        expect(assemblerInterpreter(`mov   a, 11           ; value1
        mov   b, 3            ; value2
        call  mod_func
        msg   'mod(', a, '/ ', b, ') = ', d        ; output
        end
        
        ; Mod function
        mod_func:
            mov   c, a        ; temp1
            div   c, b
            mul   c, b
            mov   d, a        ; temp2
            sub   d, c
            ret`)).toBe('mod(11/ 3) = 2')
    });

    it('cw: this should fail', () => {
        expect(assemblerInterpreter(`call  func1
        call  print
        end
        
        func1:
            call  func2
            ret
        
        func2:
            ret
        
        print:
            msg 'This program should return -1'`)).toBe(-1)
    });

    it('cw: fibonacci', () => {
        expect(assemblerInterpreter(`mov   a, 8            ; value
        mov   b, 0            ; next
        mov   c, 0            ; counter
        mov   d, 0            ; first
        mov   e, 1            ; second
        call  proc_fib
        call  print
        end
        
        proc_fib:
            cmp   c, 2
            jl    func_0
            mov   b, d
            add   b, e
            mov   d, e
            mov   e, b
            inc   c
            cmp   c, a
            jle   proc_fib
            ret
        
        func_0:
            mov   b, c
            inc   c
            jmp   proc_fib
        
        print:
            msg   'Term ', a, ' of Fibonacci series is: ', b        ; output text
            ret`)).toBe('Term 8 of Fibonacci series is: 21')
    });

    it('cw: gcd', () => {
        expect(assemblerInterpreter(`mov   a, 81         ; value1
        mov   b, 153        ; value2
        call  init
        call  proc_gcd
        call  print
        end
        
        proc_gcd:
            cmp   c, d
            jne   loop
            ret
        
        loop:
            cmp   c, d
            jg    a_bigger
            jmp   b_bigger
        
        a_bigger:
            sub   c, d
            jmp   proc_gcd
        
        b_bigger:
            sub   d, c
            jmp   proc_gcd
        
        init:
            cmp   a, 0
            jl    a_abs
            cmp   b, 0
            jl    b_abs
            mov   c, a            ; temp1
            mov   d, b            ; temp2
            ret
        
        a_abs:
            mul   a, -1
            jmp   init
        
        b_abs:
            mul   b, -1
            jmp   init
        
        print:
            msg   'gcd(', a, ' / ', b, ') = ', c
            ret`)).toBe('gcd(81 / 153) = 9')
    });

    it('cw: program power', () => {
        expect(assemblerInterpreter(`mov   a, 2            ; value1
        mov   b, 10           ; value2
        mov   c, a            ; temp1
        mov   d, b            ; temp2
        call  proc_func
        call  print
        end
        
        proc_func:
            cmp   d, 1
            je    continue
            mul   c, a
            dec   d
            call  proc_func
        
        continue:
            ret
        
        print:
            msg a, '^', b, ' = ', c
            ret`)).toBe('2^10 = 1024')
    });
});