import { Elem, Signal, Var } from '../../../src/index.js';

export default class extends Elem {
    _v = new Var(0);

    constructor(el) {
        super();
        this.el = el;
    }

    init({ value }) {
        for(let id of value.split(':')) {
            const el = this.el.querySelector(`[id='${id}']`);
            this.mount(el, el);
        }
    }

    bd({ value }, el) {
        if(value == '') {
            this._v.observer(val => {
                Object.assign(el, {
                    innerText: val,
                    className: val >= 0 ? 'pos' : 'neg'
                });
            });
        } else if(value.startsWith('&')) {
            this._v.observer(val => {
                Signal.send(value.slice(1), { data: val });
            });
        }
    }

    ev({ value, params }, el) {
        el['on' + params[0]] = () => this._v.value += value * 1;
    }

    onMount() {
        this._v.value = 0;
    }

}
