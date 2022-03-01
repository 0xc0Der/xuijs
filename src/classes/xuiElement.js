import BaseElement from '../core/baseElement.js';
import Scope from './utils/scope.js';

export default class XuiElement extends BaseElement {
    #scopes = {};

    constructor(el) {
        super();

        this.el = el;
    }

    attrsFilter(attrs) {
        return Object.values(attrs).filter(attr =>
            attr.nodeName.startsWith('$')
        );
    }

    attrValueParser(attrValue) {
        const [variable, func] = attrValue.split('@');

        return { func, variable };
    }

    attrNameParser(attrName) {
        const [func, ...params] = attrName.split(':');

        return { func, params };
    }

    $init({ value }, el = this.el) {
        const { variable: scope } = value;

        if (scope) {
            el.setAttribute('scope', scope);
        }

        for (let child of el.children) {
            for (let attr of this.handelAttributes(child)) {
                attr.ownerElement.removeAttribute(attr.nodeName);
            }
        }
    }

    $event({ value, params }, el = this.el) {
        const [eventName] = params;

        el['on' + eventName] = event => this[value.func](event);
    }

    $bind({ value, params }, el = this.el) {
        const [prop] = params;
        const { variable, func } = value;
        const toCap = prop => prop.replace(/-[a-z]/g, m => m[1].toUpperCase());

        if (prop.startsWith('.')) {
            this[variable].addObserver((val, oldVal) => {
                el[toCap(prop).slice(1)] = this[func](val, oldVal);
            });
        } else {
            this[variable].addObserver((val, oldVal) => {
                el.setAttribute(prop, this[func](val, oldVal));
            });
        }
    }

    $name({ value }, el = this.el) {
        const { variable: name, func: sigDispt } = value;

        if (el !== this.el) {
            throw new Error('invalid $name attribute.');
        }

        window[sigDispt].register(
            name.startsWith('.') ? this[name.slice(1)] : name,
            this
        );
    }

    $if({ value, params }, el = this.el) {
        const scope = params[0] || el.parentElement.getAttribute('scope');
        const { variable, func } = value;

        if (!this.#scopes.hasOwnProperty(scope)) {
            this.#scopes[scope] = new Scope(scope);
        }

        this.#scopes[scope].open('if', (value, oldValue) => {
            return this[func]({ value, oldValue }, el);
        });

        this[variable].addObserver((val, oldVal) => {
            this.#scopes[scope].run(val, oldVal);
        });
    }

    $elif({ value, params }, el = this.el) {
        const scope = params[0] || el.parentElement.getAttribute('scope');
        const { func } = value;

        if (!this.#scopes.hasOwnProperty(scope)) {
            throw new Error(`scope "${scope}" is undefined.`);
        }

        this.#scopes[scope].open('elif', (value, oldValue) => {
            return this[func]({ value, oldValue }, el);
        });
    }

    $else({ value, params }, el = this.el) {
        const scope = params[0] || el.parentElement.getAttribute('scope');
        const { func } = value;

        if (!this.#scopes.hasOwnProperty(scope)) {
            throw new Error(`scope "${scope}" is undefined.`);
        }

        this.#scopes[scope].close('else', (value, oldValue) => {
            this[func]({ value, oldValue }, el);

            return false;
        });
    }

    $for({ value, params }, el = this.el) {
        const [name] = params;
        const { func, variable } = value;

        this[variable].addObserver((list, oldList) => {
            const foreach = this[func](name, { list, oldList }, el);

            if (typeof foreach !== 'function') {
                throw new Error(`return type in "${func}" must be a function.`);
            }

            for (let [key, value] of Object.entries(list)) {
                foreach({ key, value });
            }
        });
    }
}
