import BaseElement from '../core/baseElement.js'

export default class XuiElement extends BaseElement {

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

    $init(_, el = this.el) {
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

    $name({ value }) {
        const name = value.variable;

        Signals.register(
            name.startsWith('.') ? this[name.slice(1)] : name,
            this
        );
    }

}
