import {AFFIRMATIVE_ANSWERS} from './constants';

export function noop() {
    return;
}

export function isAffirmativeAnswer(answer: string, isDefaultAnswerAffirmative = false): boolean {
    if (isDefaultAnswerAffirmative && (!answer || answer === '')) {
        return true;
    }
    return !answer || AFFIRMATIVE_ANSWERS.includes(answer.toLowerCase());
}
