export const decoder = (encoded: string, marker: string): string => encoded
    .split(marker)
    .map((elem, idx) => idx % 2 === 0 ? elem : elem.split('').reverse().join(''))
    .reduce<string[][]>((arr, str, idx) => idx % 2 === 0
        ? [[...arr[0], str], [...arr[1]]]
        : [[...arr[0]], [str, ...arr[1]]], [[], []])
    .reduce<string>((decoded, elems) => `${decoded}${elems.join('')}`, '');