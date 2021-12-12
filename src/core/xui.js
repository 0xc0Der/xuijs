export default class Xui {
    mount = 'mount';
    prevent = 'prevent';
    selector = `[${this.mount}]:not([${this.prevent}])`;

    async init(
        elem,
        data,
        funcs = {
            after: 'onMount',
            before: 'onBeforeMount'
        }
    ) {
        for (let mnt of elem.querySelectorAll(this.selector)) {
            (await this.loadClass(mnt)).mount(mnt, data, funcs);
        }
    }

    async loadClass(elem) {
        if (!elem.hasAttribute(this.mount)) {
            throw new Error(`element doesn't have "${this.mount}" attribute.`);
        }

        const [ctrl, cls = 'default'] = elem
            .getAttribute(this.mount)
            .split(':');

        const mod = await import(document.baseURI + (ctrl || 'index') + '.js');

        elem.removeAttribute(this.mount);
        elem.removeAttribute(this.prevent);

        return new mod[cls](elem);
    }
}
