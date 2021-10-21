import { XuiElement } from '../../../src/index.js';

export default class extends XuiElement {

    constructor(el) {
        super(el);

        this.defineData('val', 0);
    }

    str(val) {
        return `${val} is ${val < 0 ? 'negative' : 'positive'}`;
    }

    cls(val) {
        return `nut ${val >= 0 ? 'posb' : 'negb'}`;
    }

    signal(v) {
        this.val = v;
    }

}
