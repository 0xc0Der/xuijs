import { XuiElement } from '../../../src/index.js';

export default class extends XuiElement {

    constructor(el) {
        super(el);

        this.defineData('count', 0);
    }

    decCount() {
        this.count -= 1;
    }

    incCount() {
        this.count += 1;
    }

    cls(cnt) {
        return cnt >= 0 ? 'pos': 'neg';
    }

    onMount() {
        this.addObserver('count', val => {
            this.send('scr', { data: val });
        });

        this.count = 0;
    }

}
