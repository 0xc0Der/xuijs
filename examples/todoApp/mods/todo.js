import { XuiElement } from '../../../src/index.js';

export default class extends XuiElement {

    constructor(el) {
        super(el);

        this.defineData('obj', {});
    }

    sendChangeSig(data) {
        this.send('list', {
            prefix:'sig',
            signal: 'Change',
            data: [this.key, data]
         });
    }

    incPrio() {
        this.sendChangeSig({ prio: this.obj.prio + 1 });
    }

    decPrio() {
        this.sendChangeSig({ prio: this.obj.prio - 1 });
    }

    toggleDone() {
        this.sendChangeSig({ done: !this.obj.done });
    }

    delete() {
        return this.sendChangeSig({});
    }

    cls(obj){
        return `${
            obj.prio < 5 ? 'low' : obj.prio < 10 ? 'medium' : 'high'
        }${
            obj.done ? ' done' : ''
        }`
    }

    sigSet(data) {
        this.obj = data;
    }

    onBeforeMount(_, data) {
        this.key = data.key;
        this.name = data.name;
    }

    onUnmount() {
        this.unregister(this.name);
        this.el.remove();
    }

}
