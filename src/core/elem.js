import { Var } from './var.js';
import { Signal } from './signal.js';

export class Elem {
    #vars = {};

    mount(el, data, funcs, handel = this.propFormat) {
        const del = [];

        this.#callLSFunc(funcs?.before, el, data);

        for(let attr of el.attributes) {
            const [name, ...params] = handel(attr.nodeName);

            if(this[name]) {
                del.push(attr);

                this[name]({
                    value: attr.nodeValue,
                    params
                }, data);
            }
        }

        this.#callLSFunc(funcs?.after, el, data);

        for(let attr of del) {
            attr.ownerElement.removeAttribute(attr.nodeName);
        }
    }

    unmount(el, data, func = 'onUnmount') {
        this.#callLSFunc(func, el, data);
    }

    register(name, obj) {
        return Signal.register(name, obj ?? this);
    }

    unregister(name) {
        Signal.unregister(name);
    }

    send(name, info) {
        return Signal.send(name, info);
    }

    prodcast(info, pattern) {
        return Signal.prodcast(info, pattern);
    }

    defineData(name, value) {
        const vr = new Var(value);

        Object.defineProperty(this, name, {
            set: val => {
                vr.value = val;
            },
            get: () => {
                return vr.value;
            }
        });

        this.#vars[name] = func => vr.observer(func);
    }

    get(name) {
        return Signal.get(name);
    }

    addObserver(vr, func) {
        this.#vars[vr].call(null, func);
    }

    propFormat(prop) {
        const [n, ...p] = prop.split(':');

        return [n[0] == '$' ? n.slice(1) : '', ...p];
    }

    #callLSFunc(func, el, data) {
        if(typeof func == 'string' && this[func]) {
            this[func](el, data);
        } else if(typeof func == 'function') {
            func(el, data);
        }
    }

}
