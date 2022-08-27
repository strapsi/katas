export const myFirstInterpreter = (code: string): string => code.split('')
    .reduce<{ text: string, cell: number }>((output: { text: string, cell: number }, command: string) => {
        if (command === '+') output.cell = output.cell === 255 ? 0 : output.cell + 1
        else if (command === '.') output.text += String.fromCharCode(output.cell)
        return output
    }, {text: '', cell: 0}).text