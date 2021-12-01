import { XuiElement, Variable } from '../../../src/index.js';

export default class extends XuiElement {

    constructor(el) {
        super(el);

        this.todo = new Variable({});
    }

    sendChangeSig(data) {
        Signals.send('list', {
            signal: 'sigChange',
            data: [this.key, data]
         });
    }

    incPrio() {
        this.sendChangeSig({ prio: this.todo.value.prio + 1 });
    }

    decPrio() {
        this.sendChangeSig({ prio: this.todo.value.prio - 1 });
    }

    toggleDone() {
        this.sendChangeSig({ done: !this.todo.value.done });
    }

    deleteTodo() {
        return this.sendChangeSig({});
    }

    getPrio(todo) {
        return todo.prio;
    }

    getStr(todo) {
        return todo.str;
    }

    getDone(todo) {
        return todo.done;
    }

    className(todo){
        return `${
            todo.prio < 5 ? 'low' : todo.prio < 10 ? 'medium' : 'high'
        }${
            todo.done ? ' done' : ''
        }`
    }

    sigSet(data) {
        this.todo.value = data;
    }

    onBeforeMount(_, data) {
        this.key = data.key;
        this.name = data.name;
    }

    onUnmount() {
        Signals.unregister(this.name);
        this.el.remove();
    }

}
