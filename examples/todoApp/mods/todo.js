import { Var, Elem, Signal } from '../../../src/index.js';

export default class extends Elem {
    _obj = new Var({});

    constructor(el) {
        super();
        this.el = el;
        this.key = el.getAttribute('key');
    }

    init({ value }) {
        for(let el of this.el.querySelectorAll(`[${value}]`)) {
            this.mount(el, el);
        }
    }

    bd({ value, params }, el) {
        const fns = {
            '@cnm': val => `${
                val.prio < 5 ? 'low' : val.prio < 10 ? 'medium' : 'high'
            } ${
                val.done ? 'done' : ''
            }`
        }, nms = {
            '.txt': 'innerText',
            '.cls': 'className',
            '.chk': 'checked'
        }, prop = params[0];

        if(prop.startsWith('.')) {
            this._obj.observer(val => {
                Object.assign(el, {
                    [nms[prop]]: val[value] ?? fns[value](val)
                });
            });
        } else {
            this._obj.observer(val => {
                el.setAttribute(value, val[value] ?? fns[value](val));
            });
        }
    }

    ev({ value, params }, el) {
        const fns = {
            '@inc': val => ({ prio: val.prio + 1 }),
            '@dec': val => ({ prio: val.prio - 1 }),
            '@tog': val => ({ done: !val.done }),
            '@nop': () => ({})
        }, ev = params[0];

        el['on' + ev] = () => {
            Signal.send('list', {
                prefix:'sig',
                signal: 'Change',
                data: [this.key, fns[value](this._obj.value)]
            });
        }
    }

    signal(data) {
        this._obj.value = data;
    }

    onMount() {
        Signal.register('todo' + this.key, this);
    }

}
