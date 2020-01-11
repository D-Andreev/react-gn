export function noop() {
    return;
}

export function minOfThreeNumbers(x: number, y: number, z: number): number {
    return Math.min(Math.min(x, y), z);
}

export function getEditDistance(
    command: string, correctCommand: string, commandLength: number, correctCommandLength: number): number {
    if (commandLength == 0) return correctCommandLength;
    if (correctCommandLength == 0) return commandLength;

    if (command[commandLength-1] == correctCommand[correctCommandLength-1])
        return getEditDistance(command, correctCommand, commandLength-1, correctCommandLength-1);

    return 1 + minOfThreeNumbers(
        getEditDistance(command, correctCommand, commandLength, correctCommandLength-1),
        getEditDistance(command,  correctCommand, commandLength-1, correctCommandLength),
        getEditDistance(command,  correctCommand, commandLength-1, correctCommandLength-1)
    );
}

export function toPascalCase(input: string): string {
    return `${input}`
        .replace(new RegExp(/[-_]+/, 'g'), ' ')
        .replace(new RegExp(/[^\w\s]/, 'g'), '')
        .replace(
            new RegExp(/\s+(.)(\w+)/, 'g'),
            ($1, $2, $3) => `${$2.toUpperCase() + $3.toLowerCase()}`
        )
        .replace(new RegExp(/\s/, 'g'), '')
        .replace(new RegExp(/\w/), s => s.toUpperCase());
}
