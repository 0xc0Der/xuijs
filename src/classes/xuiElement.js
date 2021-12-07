import BaseElement from '../core/baseElement.js'
import Scope from './utils/scope.js';
import { renderList } from './utils/renderList.js';

export default class XuiElement extends BaseElement {
    #scopes = {};

    constructor(el) {
        super();

        this.el = el;
    }

    attrsFilter(attrs) {
        return Object.values(attrs).filter(
            attr => attr.nodeName.startsWith('$')
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

        if(scope) {
            el.setAttribute('scope', scope);
        }

        for(let child of el.children) {
            for(let attr of this.handelAttributes(child)) {
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

        if(prop.startsWith('.')) {
            this[variable].addObserver(val => {
                el[toCap(prop).slice(1)] = this[func](val);
            });
        } else {
            this[variable].addObserver(val => {
                el.setAttribute(prop, this[func](val));
            });
        }
    }

    $name({ value }, el = this.el) {
        const { variable: name, func: sigDispt } = value;

        if(el !== this.el) {
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

        if(!this.#scopes.hasOwnProperty(scope)) {
            this.#scopes[scope] = new Scope(scope);
        }

        this.#scopes[scope].open('if', value => this[func](value, el));

        this[variable].addObserver(val => {
            this.#scopes[scope].run(val);
        });
    }

    $elif({ value, params }, el = this.el) {
        const scope = params[0] || el.parentElement.getAttribute('scope');
        const { func } = value;

        if(!this.#scopes.hasOwnProperty(scope)) {
            throw new Error(`scope "${scope}" is undefined.`);
        }

        this.#scopes[scope].add('elif', value => this[func](value, el));
    }

    $else({ value, params }, el = this.el) {
        const scope = params[0] || el.parentElement.getAttribute('scope');
        const { func } = value;

        if(!this.#scopes.hasOwnProperty(scope)) {
            throw new Error(`scope "${scope}" is undefined.`);
        }

        this.#scopes[scope].close('else', value => {
            this[func](value, el);

            return false;
        });
    }

    $for({ value, params }, el = this.el) {
        const [name] = params;
        const { func, variable } = value;

        if(el.children.length !== 1) {
            throw new Error('$for block must have exactly one child.');
        }

        const template = el.children[0].cloneNode(true);

        el.children[0].remove();

        this[variable].addObserver(list => {
            renderList(
                list,
                name.startsWith('.') ? this[name.slice(1)] : name,
                this[func],
                template,
                el
            );
        });
    }

}
