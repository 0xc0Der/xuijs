import { XuiElement, Variable } from '../../../src/index.js';

export default class extends XuiElement {

    constructor(el) {
        super(el);

        this.count = new Variable(0);
    }

    getCount(count) {
        return `count is: ${count}`;
    }

    decCount() {
        this.count.value -= 1;
    }

    incCount() {
        this.count.value += 1;
    }

    className(count) {
        return count >= 0 ? 'pos': 'neg';
    }

    onMount() {
        this.count.addObserver(val => {
            Signals.send('signString', { signal: 'sigSetStr', data: val });
        });

        this.count.value = 0;
    }

}
