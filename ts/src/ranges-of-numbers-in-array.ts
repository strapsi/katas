export const toRange = (numbers: number[]) => Array.from(new Set(numbers.sort((a, b) => a - b)))
    .reduce<number[][]>((blocks, no) =>
        ((arr): number[][] => ((prev): number[][] => no - prev === 1
            ? [...[...blocks].slice(0, -1), [...[...blocks].pop()!!, no]]
            : [...blocks, [no]])(arr[arr.length - 1]))(blocks[blocks.length - 1] || []), [])
    .reduce<string>((str, arr, idx) =>
        `${str}${idx > 0 ? ',' : ''}${((first, last): string => first === last
            ? first.toString(10)
            : `${first}_${last}`)(arr[0], arr[arr.length - 1])}`, '');
export const toArray = (range: string): number[] => range.split(',')
    .reduce<number[]>((numbers, part) => part.includes('_')
            ? ((strings): number[] => ((from, to): number[] =>
                    [...numbers, ...Array(1 + to - from).fill('').map((_, i) => i + from)]
            )(parseInt(strings[0], 10), parseInt(strings[1])))(part.split('_'))
            : ((num): number[] => isNaN(num) ? [] : [...numbers, num])(parseInt(part, 10))
        , []);