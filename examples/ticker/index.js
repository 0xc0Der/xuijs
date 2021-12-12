import { Xui, XuiElement, Variable } from '../../src/index.js';

export class Ticker extends XuiElement {
    constructor(el) {
        super(el);

        this.ticks = new Variable(0);
        this.state = new Variable(false);
    }

    getTicks(ticks) {
        return `${ticks}`;
    }

    resetTicks() {
        this.ticks.value = 0;
    }

    getState(state) {
        return state ? 'stop' : 'start';
    }

    switchState() {
        if (this.state.value) {
            window.clearInterval(this.ticker);
        } else {
            this.ticker = window.setInterval(() => this.ticks.value++, 1000);
        }

        this.state.value = !this.state.value;
    }
}

const App = new Xui();

App.init(document.body);
