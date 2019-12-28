import {OUTPUT_TYPE} from '../constants';

export default class Output {
    public type: string;
    public contents: string;

    constructor(contents: string, type: string = OUTPUT_TYPE.NORMAL) {
        this.type = type;
        this.contents = contents;
    }
}
