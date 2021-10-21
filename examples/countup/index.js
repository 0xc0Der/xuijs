import { Xui, XuiElement } from '../../src/index.js';

export class CountUp extends XuiElement {

    constructor(el) {
        super(el);

        this.defineData('count', 0);
    }

    onMount() {
        window.setInterval(() => this.count++, 1000);
    }

}

Xui.init(document.body);
