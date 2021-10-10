import { Var, Elem, Signal, Xui } from '../../../src/index.js';

export default class extends Elem {
    _list = new Var([
        { str: "first todo", prio: 10, done: true },
        { str: "second todo", prio: 5, done: false },
        { str: "third todo", prio: 0, done: false },
    ]);

    constructor(el) {
        super();
        this.el = el;
        this.template = document.querySelector('template').content;
        this.getEl = key => el.querySelector(`[key='${key}']`);
    }

    async renderList() {
        let key = 0;

        for(let obj of this._list.value) {
            this.getEl(key) ?? await this.addElem(key);

            Signal.send('todo' + key++, { data: obj }); 
        }

        for(let elm = this.getEl(key); elm; key++, elm = this.getEl(key)) {
            this.unMount(elm, key);
        }
    }

    listElem(key) {
        const todo = this.template.children[0].cloneNode(true);

        todo.setAttribute('key', key);

        return todo;
    }

    async addElem(key) {
        const todo = this.listElem(key),
              ctrl = await Xui.loader(todo);

        this.el.appendChild(todo);
        ctrl.mount(todo, null, { after: 'onMount' });
    }

    updateList() {
        this._list.value = this._list.value
            .sort((a, b) => b.prio - a.prio)
            .sort((a, b) => a.done - b.done);
    }

    sigAdd(obj) {
        obj.str && this._list.value.push(obj);
    }

    sigChange([idx, val]) {
        if(Object.keys(val).length == 0) {
            this._list.value.splice(idx, 1);
        } else {
            Object.assign(this._list.value[idx], val);
        }
    }

    onMount() {
        Signal.register("list", this).finally(() => this.updateList());

        this._list.observer(() => this.renderList());

        this._list.observer(val => {
            this.getEl(-1).style.display = `${
                val.length == 0 ? 'block' : 'none'
            }`;
        });

        this.updateList();
    }

    onUnmount(el, key) {
        Signal.unRegister('todo' + key);
        el.remove();
    }

}
