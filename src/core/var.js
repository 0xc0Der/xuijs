export class Var {
    #funcs = [];
    #value;

    constructor (val) {
        this.#value = val;
    }

    set value(val) {
        for(let func of this.#funcs) {
            func.call(null, val, this.#value);
        }

        this.#value = val;
    }

    get value() {
        return this.#value;
    }

    observer(fun) {
        this.#funcs.push(fun);
    }

}
