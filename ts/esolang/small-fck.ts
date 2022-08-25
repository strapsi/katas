const flip = (idx: number, tape: string): string => tape
    .split('')
    .reduce((flipped, char, index) => flipped + (idx === index ? (char === '0' ? '1' : '0') : char), '');

const matching = (commands: string[], pointer: number): number | undefined => {
    const brackets = commands
        .map((it, idx) => it === '[' || it === ']' ? {left: it === '[', index: idx} : null)
        .filter(Boolean);
    const found: any = brackets.find(it => it?.index === pointer);
    const indexOf = brackets.indexOf(found);
    return [...brackets].reverse()[indexOf]?.index;
};

export const interpreter = (code: string, tape: string): string => {
    const commands = code.split('');
    let [ip, tp] = [0, 0];
    let result = tape;
    while (ip < commands.length) {
        const command = commands[ip];
        if (command === '*') result = flip(tp, result);
        else if (command === '>') tp++;
        else if (command === '<') tp--;
        else if (command === '[' && result[tp] === '0')
            ip = matching(commands, ip) || commands.length + 100;
        else if (command === ']' && result[tp] !== '0') {
            ip = matching(commands, ip) || commands.length + 100;
            continue;
        }
        if (tp < 0 || tp > tape.length - 1) break;
        ip++;
    }
    return result;
};