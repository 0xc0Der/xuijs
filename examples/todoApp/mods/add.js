import { Var, Elem, Signal } from '../../../src/index.js';

export default class extends Elem {
    _str = new Var('');

    constructor(el) {
        super();
        this.el = el;
    }

    init({ value }) {
        for(let el of this.el.querySelectorAll(`[${value}]`)) {
            this.mount(el, el);
        }
    }

    ev({ value, params }, el) {
        const fns = {
            '@add': () => {
                Signal.send('list', {
                    prefix: 'sig',
                    signal: 'Add',
                    data: {
                        str: this._str.value,
                        prio: 0,
                        done: false
                    }
                });

                this._str.value = '';
            },
            '@ch': () => this._str.value = el.value
        }, ev = params[0];

        el['on' + ev] = fns[value];
    }

    bd({ _, params }, el) {
        const nms = {
            '.v': 'value'
        }, prop = params[0];

        this._str.observer(val => {
            Object.assign(el, {
                [nms[prop]]: val
            });
        });
    }

}
