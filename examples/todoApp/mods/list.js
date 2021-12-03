import { XuiElement, Variable } from '../../../src/index.js';

export default class extends XuiElement {

    constructor(el) {
        super(el);

        this.list = new Variable([
            { str: "first todo", prio: 10, done: true },
            { str: "second todo", prio: 5, done: false },
            { str: "third todo", prio: 0, done: false },
        ]);
    }

    updateList() {
        this.list.value = this.list.value
                        .sort((a, b) => b.prio - a.prio)
                        .sort((a, b) => a.done - b.done);
    }

    sigAdd(obj) {
        obj.str && this.list.value.push(obj);
    }

    sigChange({ idx, val }) {
        if(Object.keys(val).length == 0) {
            this.list.value.splice(idx, 1);
        } else {
            Object.assign(this.list.value[idx], val);
        }
    }

    LCMethods() {
        return {
            cleanup: key => {
                Signals.getRegistered(key).element.unmount();
            },
            render: (key, value) => {
                Signals.send(key, {
                    signal:'sigSet',
                    data: value
                });
            }
        };
    }

    toggleDisplay(val) {
        return val.length !== 0 && 'display: none';
    }

    onMount() {
        Signals.getRegistered('list').finally(() => this.updateList());

        this.updateList();
    }

}
