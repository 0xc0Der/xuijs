export default class Scope {
    #funcs = [];
    #name;
    #state;

    constructor(name) {
        this.#name = name;
    }

    open(name, func) {
        if(this.#state !== undefined) {
            throw new Error(`can't reopen scope ${this.#name}.`);
        }

        this.#state = 1;
        this.#funcs.push({ name, func });
    }

    close(name, func) {
        if(this.#state !== 1) {
            throw new Error(`scope ${this.#name} is not open.`);
        }

        this.#state = 0;
        this.#funcs.push({ name, func });

    }

    add(name, func) {
        if(this.#state !== 1) {
            throw new Error(`scope ${this.#name} is not open.`);
        }

        this.#funcs.push({ name, func });
    }

    run(value, oldValue) {
        for(let dir of this.#funcs) {
            const res = dir.func(value, oldValue);

            if(res === false) {
                continue;
            } else if(typeof res === 'function') {
                res();
                break;
            } else {
                throw new Error(
                    `scope ${this.#name}: invalid return type in ${func.name}.`
                );
            }
        }
    }

}
