import { XuiElement, Xui, Variable } from '../../../src/index.js';

export default class extends XuiElement {

    constructor(el) {
        super(el);

        this.list = new Variable([]);
    }

    updateList(newList) {
        this.list.value = newList
                        .sort((a, b) => b.prio - a.prio)
                        .sort((a, b) => a.done - b.done);
    }

    sigAdd(todo) {
        todo.str && this.updateList([ ...this.list.value, todo ]);
    }

    sigChange({ idx, val }) {
        const newList = this.list.value.slice();

        if(Object.keys(val).length == 0) {
            newList.splice(idx, 1);
        } else {
            Object.assign(newList[idx], val);
        }

        this.updateList(newList);
    }

    renderTodoList(name, lists, el) {
        if(this.template === undefined) {
            this.template = el.children[0].cloneNode(true);
            el.children[0].remove();
        }

        if(lists.oldList.length > lists.list.length) {
            const last = lists.oldList.length - 1;

            Signals.getRegistered(`${name} - ${last}`).unmount();
        }

        const forEachTodo = async data => {
            const key = `${name} - ${data.key}`;

            if(!Signals.isRegistered(key)) {
                const element = this.template.cloneNode(true);
                const ctrl = new Xui();

                el.appendChild(element);

                (await ctrl.loadClass(element)).mount(
                    element, key, { before: 'onBeforeMount', after: 'onMount' }
                );
            }

            Signals.send(key, {
                signal:'sigSet',
                data: data.value
            });

        };

        return forEachTodo;
    }

    toggleDisplay(list) {
        return list.length !== 0 && 'display: none';
    }

    onMount(el) {
        this.updateList([
            { str: "first todo", prio: 10, done: true },
            { str: "second todo", prio: 5, done: false },
            { str: "third todo", prio: 0, done: false },
        ]);
    }

}
