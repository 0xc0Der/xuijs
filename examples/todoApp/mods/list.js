import { XuiElement, Xui } from '../../../src/index.js';

export default class extends XuiElement {

    constructor(el) {
        super(el);

        this.defineData('list', [
            { str: "first todo", prio: 10, done: true },
            { str: "second todo", prio: 5, done: false },
            { str: "third todo", prio: 0, done: false },
        ]);
    }

    async renderList() {
        let key = 0;
        const getElByKey = key => this.el.querySelector(`[key='${key}']`);

        for(let obj of this.list) {
            getElByKey(key) ?? await this.addElem(key);

            this.send('todo' + key++, {
                prefix:'sig',
                signal:'Set',
                data: obj
            }); 
        }

        for(let elm = getElByKey(key); elm; key++, elm = getElByKey(key)) {
            this.get('todo' + key).elem.unmount();
        }
    }

    listElem(key) {
        const template = document.querySelector('template').content,
              todo = template.children[0].cloneNode(true);

        todo.setAttribute('key', key);

        return todo;
    }

    async addElem(key) {
        const todo = this.listElem(key),
              ctrl = await Xui.loader(todo);

        this.el.appendChild(todo);

        ctrl.mount(todo, { key, name: 'todo' + key }, {
            before: 'onBeforeMount'
        });
    }

    updateList() {
        this.list = this.list.sort((a, b) => b.prio - a.prio)
                             .sort((a, b) => a.done - b.done);
    }

    sigAdd(obj) {
        obj.str && this.list.push(obj);
    }

    sigChange([idx, val]) {
        if(Object.keys(val).length == 0) {
            this.list.splice(idx, 1);
        } else {
            Object.assign(this.list[idx], val);
        }
    }

    display(val) {
        return val.length != 0 && 'display: none';
    }

    onMount() {
        this.get('list').finally(() => this.updateList());

        this.addObserver('list', () => this.renderList());

        this.updateList();
    }

}
