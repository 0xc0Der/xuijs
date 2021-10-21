import { XuiElement } from '../../../src/index.js';

export default class extends XuiElement {

    constructor(el) {
        super(el);

        this.defineData('str', '');
    }

    addTodo() {
        this.send('list', {
            prefix: 'sig',
            signal: 'Add',
            data: {
                str: this.str,
                prio: 0,
                done: false
            }
        });

        this.str = '';
    }
 
    setStr(e) {
        this.str = e.target.value;
    }

}
