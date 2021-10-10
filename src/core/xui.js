export const Xui = new class {
    attr = 'mount';

    async init(
        elem,
        data,
        funcs = {
            after: 'onMount',
            before: 'onBeforeMount'
        },
        handel
    ) {
        for(let mnt of elem.querySelectorAll(`[${this.attr}]`)) {
            (await this.loader(mnt)).mount(mnt, data, funcs, handel);
        }
    }

    async loader(elem) {
        const [
            ctrl,
            cls = 'default'
        ] = elem.getAttribute(this.attr).split(':'),
            mod = await import(document.baseURI + ctrl + '.js');

        elem.removeAttribute(this.attr);

        return new mod[cls](elem);
    }

}

export { Elem } from './elem.js';
export { Var } from './var.js';
export { Signal } from './signal.js';
