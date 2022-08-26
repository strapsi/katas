const parseParams = params => params.split('').reduce((info, char, idx) => {
    if (info.done || (char === ' ' && !info.inString)) return info;
    else if (info.inString) {
        info.current += char;
        info.inString = char !== '\'';
    } else if (char === ',') {
        info.params.push(info.current);
        info.current = '';
    } else if (char === '\'') {
        info.inString = true;
        info.current = char;
    } else if (char === ';') {
        info.params.push(info.current);
        info.done = true;
    } else info.current += char;
    if (idx === params.length - 1) info.params.push(info.current);
    return info;
}, {inString: false, params: [], current: '', done: false}).params;

const destructureParams = params => ((idx) => {
    const cmd = params.substring(0, idx > 0 ? idx : undefined);
    return [cmd, ...parseParams(params.substring(cmd.length))];
})(params.indexOf(' '));

const intValue = (param, registers) => ((number) => isNaN(number) ? registers[param] : number)(parseInt(param));
const stringValue = (param, registers) => param.startsWith('\'') ? param.substring(1, param.length - 1) : registers[param];
const shouldJump = ({cmp1, cmp2}, condition) => {
    if (condition === 'jmp') return true;
    const [eq, lg] = [cmp1 === cmp2, cmp1 > cmp2];
    if (condition === 'jne') return !eq;
    else if (condition === 'je') return eq;
    else if (condition === 'jge') return lg || eq;
    else if (condition === 'jg') return lg;
    else if (condition === 'jle') return !lg;
    else if (condition === 'jl') return !lg && !eq;
};

const assemblerInterpreter = program => {
    const P = {$: {p: 0, cs: [], m: undefined, cmp1: undefined, cmp2: undefined}, $$: {}};
    const I = program.split('\n').map(it => it.trim()).filter(it => !it.startsWith(';')).filter(Boolean);
    I.forEach((inst, idx) => {
        if (inst.endsWith(':')) P.$$[inst.substring(0, inst.length - 1)] = idx;
    });
    while (P.$.p < I.length) {
        const params = destructureParams(I[P.$.p]);
        if (params[0] === 'end') return P.$.m;
        else if (params[0] === 'mov') P[params[1]] = intValue(params[2], P);
        else if (params[0] === 'msg') P.$.m = params.reduce((prev, curr, index) => `${prev}${index > 0 ? stringValue(curr, P) : ''}`, '');
        else if (params[0] === 'inc') P[params[1]] += 1;
        else if (params[0] === 'dec') P[params[1]] -= 1;
        else if (params[0] === 'add') P[params[1]] += intValue([params[2]], P);
        else if (params[0] === 'sub') P[params[1]] -= intValue([params[2]], P);
        else if (params[0] === 'mul') P[params[1]] *= intValue([params[2]], P);
        else if (params[0] === 'div') P[params[1]] = Math.floor(P[params[1]] / intValue([params[2]], P));
        else if (params[0] === 'ret') P.$.p = P.$.cs.pop();
        else if (['jmp', 'jne', 'je', 'jge', 'jg', 'jle', 'jl'].includes(params[0]) && shouldJump(P.$, params[0])) P.$.p = P.$$[params[1]];
        else if (params[0] === 'cmp') {
            P.$.cmp1 = intValue(params[1], P);
            P.$.cmp2 = intValue(params[2], P);
        } else if (params[0] === 'call') {
            P.$.cs.push(P.$.p);
            P.$.p = P.$$[params[1]];
        }
        P.$.p++;
    }
    return -1;
};

module.exports = assemblerInterpreter;