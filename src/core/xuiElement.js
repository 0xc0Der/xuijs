import { Elem } from './elem.js'

export class XuiElement extends Elem {

    constructor(el) {
        super();
        this.el = el;
    }

    parseValue(val) {
        if(val.includes('@')) {
            const [vr, fn] = val.split('@');

            return [vr, this[fn]];
        } else if(val.includes('.')) {
            const [vr, prp] = val.split('.');

            return [vr, obj => obj[prp]];
        } else {
            return [val, val => val];
        }
    }

    propFormat(prop) {
        const [n, ...p] = prop.split(':'),
              ns = n.slice(1);

        switch(n[0]) {
            case '*':
                return ['$bind', ns];
            case '@':
                return ['$event', ns];
            case '$':
                return [n, ...p];
        }

        return [];
    }

    $init({value}) {
        const children = value
                       ? this.el.querySelectorAll(value)
                       : this.el.children;

        for(let el of children) {
            this.mount(el, el);
        }
    }

    $event({value, params}, el = this.el) {
        el['on' + params[0]] = e => this[value](e);
    }

    $bind({value, params}, el = this.el) {
        const prop = params[0], [vr, func] = this.parseValue(value),
              toCap = prop => prop.replace(/-[a-z]/g, m => m[1].toUpperCase());

        if(prop.startsWith('.')) {
            this.addObserver(vr, val => {
                el[toCap(prop).slice(1)] = func(val);
            });
        } else {
            this.addObserver(vr, val => {
                el.setAttribute(prop, func(val));
            });
        }
    }

    $name({value}) {
        this.register(value[0] == '.' ? this[value.slice(1)] : value);
    }

}
