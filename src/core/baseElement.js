export default class BaseElement {
    mount(el, data, funcs) {
        this.#callLifeCycleMethod(funcs?.before, el, data);

        for (let attr of this.handelAttributes(el)) {
            attr.ownerElement.removeAttribute(attr.nodeName);
        }

        this.#callLifeCycleMethod(funcs?.after, el, data);
    }

    unmount(el, data, func = 'onUnmount') {
        this.#callLifeCycleMethod(func, el, data);
    }

    handelAttributes(el) {
        const attrs = [];

        for (let attr of this.attrsFilter(el.attributes)) {
            const { func, params } = this.attrNameParser(attr.nodeName);

            if (this[func]) {
                attrs.push(attr);

                this[func](
                    {
                        value: this.attrValueParser(attr.nodeValue),
                        params
                    },
                    el
                );
            } else {
                throw new Error(`${func} not defined.`);
            }
        }

        return attrs;
    }

    #callLifeCycleMethod(func, el, data) {
        if (typeof func === 'string' && this[func]) {
            this[func](el, data);
        } else if (typeof func === 'function') {
            func(el, data);
        }
    }
}
