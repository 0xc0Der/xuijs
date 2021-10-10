import { Elem, Signal, Var } from '../../../src/index.js';

export default class extends Elem {
    _v = new Var(0);

    constructor(el) {
        super();
        this.el = el;
    }

    signal(v) {
        this._v.value = v;
    }

    bd() {
        this._v.observer(val => {
            Object.assign(this.el, {
                innerText: `${val} is ${ val < 0 ? 'negative' : 'positive' }`,
                className: `nut ${ val >= 0 ? 'posb' : 'negb' }`
            });
        });
    }

    onMount() {
        Signal.register('scr', this);
    }
}
