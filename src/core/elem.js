export class Elem {

    mount(el, data, funcs, handel = name => {
        const [n, ...p] = name.split(':');

        return [n[0] == '$' ? n.slice(1) : '', ...p];
    }) {
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

    unMount(el, data, func = 'onUnmount') {
        this.#callLSFunc(func, el, data);
    }

    #callLSFunc(func, el, data) {
        if(typeof func == 'string' && this[func]) {
            this[func](el, data);
        } else if(typeof func == 'function') {
            func(el, data);
        }
    }

}
