import { XuiElement, Variable } from '../../../src/index.js';

export default class extends XuiElement {

    constructor(el) {
        super(el);

        this.count = new Variable(0);
    }

    getSignStr(val) {
        return `${val} is ${val < 0 ? 'negative' : 'positive'}`;
    }

    className(val) {
        return `nut ${val >= 0 ? 'posb' : 'negb'}`;
    }

    sigSetStr(val) {
        this.count.value = val;
    }

}
