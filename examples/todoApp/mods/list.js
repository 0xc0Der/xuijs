import { XuiElement, Xui, Variable } from '../../../src/index.js';

export default class extends XuiElement {

    constructor(el) {
        super(el);

        this.list = new Variable([
            { str: "first todo", prio: 10, done: true },
            { str: "second todo", prio: 5, done: false },
            { str: "third todo", prio: 0, done: false },
        ]);
    }

    async renderList(list) {
        const getElementByKey = key => this.el.querySelector(`[key='${key}']`);

        for(let [key, value] of Object.entries(list)) {
            getElementByKey(key) ?? await this.addListElement(key);

            Signals.send('todo' + key, {
                signal:'sigSet',
                data: value
            }); 
        }

        for(let elm of this.el.children) {
            const key = elm.getAttribute('key');

            if(key && !Object.keys(list).includes(key)) {
                Signals.getRegistered('todo' + key).element.unmount();
            }
        }
    }

    makeListElement() {
        const template = document.querySelector('template').content,
              todo = template.children[0].cloneNode(true);

        return todo;
    }

    async addListElement(key) {
        const todo = this.makeListElement(),
              ctrl = await new Xui().loadClass(todo);

        todo.setAttribute('key', key);
        this.el.appendChild(todo);

        ctrl.mount(todo, { key, name: 'todo' + key }, {
            before: 'onBeforeMount'
        });
    }

    updateList() {
        this.list.value = this.list.value
                        .sort((a, b) => b.prio - a.prio)
                        .sort((a, b) => a.done - b.done);
    }

    sigAdd(obj) {
        obj.str && this.list.value.push(obj);
    }

    sigChange([idx, val]) {
        if(Object.keys(val).length == 0) {
            this.list.value.splice(idx, 1);
        } else {
            Object.assign(this.list.value[idx], val);
        }
    }

    toggleDisplay(val) {
        return val.length != 0 && 'display: none';
    }

    onMount() {
        Signals.getRegistered('list').finally(() => this.updateList());

        this.list.addObserver(list => this.renderList(list));
        this.updateList();
    }

}
