import { XuiElement, Variable } from '../../../src/index.js';

export default class extends XuiElement {
    constructor(el) {
        super(el);

        this.str = new Variable('');
    }

    addTodo() {
        Signals.send('list', {
            signal: 'sigAdd',
            data: {
                str: this.str.value,
                prio: 0,
                done: false
            }
        });

        this.str.value = '';
    }

    getStr(str) {
        return str;
    }

    setStr(e) {
        this.str.value = e.target.value;
    }
}
