import { Xui, XuiElement, Variable } from '../../src/index.js';

export class CountUp extends XuiElement {

    constructor(el) {
        super(el);

        this.count = new Variable(0);
    }

    getCount(count) {
        return count;
    }

    onMount() {
        window.setInterval(() => this.count.value++, 1000);
    }

}

const App = new Xui();

App.init(document.body);
