export default class Xui {
    selector = 'mount';

    async init(
        elem,
        data,
        funcs = {
            after: 'onMount',
            before: 'onBeforeMount'
        }
    ) {
        for(let mnt of elem.querySelectorAll(`[${this.selector}]`)) {
            (await this.loadClass(mnt)).mount(mnt, data, funcs);
        }
    }

    async loadClass(elem) {
        const [
            ctrl,
            cls = 'default'
	] = elem.getAttribute(this.selector).split(':');

        const mod = await import(document.baseURI + (ctrl || 'index') + '.js');

        elem.removeAttribute(this.selector);

        return new mod[cls](elem);
    }

}
