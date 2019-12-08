import {AFFIRMATIVE_ANSWERS} from './constants';

export function noop() {
    return;
}

export function isAffirmativeAnswer(answer: string, defaultValue = false): boolean {
    if (defaultValue && (!answer || answer === '')) {
        return true;
    }
    if (!answer) return defaultValue;

    return AFFIRMATIVE_ANSWERS.includes(answer.toLowerCase());
}
